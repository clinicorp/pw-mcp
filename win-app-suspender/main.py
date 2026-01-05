import os
import subprocess
import sys
import threading
import time
import tkinter as tk
from dataclasses import dataclass
from tkinter import filedialog, messagebox, ttk

import psutil


# ---------------------------
# Windows process suspend/resume (NtSuspendProcess/NtResumeProcess)
# ---------------------------
IS_WINDOWS = sys.platform.startswith("win")

if IS_WINDOWS:
    import ctypes
    from ctypes import wintypes

    kernel32 = ctypes.WinDLL("kernel32", use_last_error=True)
    ntdll = ctypes.WinDLL("ntdll", use_last_error=True)

    PROCESS_QUERY_LIMITED_INFORMATION = 0x1000
    PROCESS_SUSPEND_RESUME = 0x0800
    PROCESS_VM_READ = 0x0010

    OpenProcess = kernel32.OpenProcess
    OpenProcess.argtypes = [wintypes.DWORD, wintypes.BOOL, wintypes.DWORD]
    OpenProcess.restype = wintypes.HANDLE

    CloseHandle = kernel32.CloseHandle
    CloseHandle.argtypes = [wintypes.HANDLE]
    CloseHandle.restype = wintypes.BOOL

    NtSuspendProcess = ntdll.NtSuspendProcess
    NtSuspendProcess.argtypes = [wintypes.HANDLE]
    NtSuspendProcess.restype = wintypes.DWORD  # NTSTATUS (treat as int)

    NtResumeProcess = ntdll.NtResumeProcess
    NtResumeProcess.argtypes = [wintypes.HANDLE]
    NtResumeProcess.restype = wintypes.DWORD  # NTSTATUS


def _format_windows_error(prefix: str) -> str:
    if not IS_WINDOWS:
        return prefix
    err = ctypes.get_last_error()
    if err:
        return f"{prefix} (WinError {err})"
    return prefix


def suspend_pid(pid: int) -> None:
    if not IS_WINDOWS:
        raise RuntimeError("Este aplicativo de suspensão/retomada funciona apenas no Windows.")
    access = PROCESS_SUSPEND_RESUME | PROCESS_QUERY_LIMITED_INFORMATION
    h_proc = OpenProcess(access, False, pid)
    if not h_proc:
        raise PermissionError(_format_windows_error(f"Falha ao abrir o processo PID={pid}."))
    try:
        status = NtSuspendProcess(h_proc)
        if status != 0:
            raise RuntimeError(f"NtSuspendProcess falhou (NTSTATUS=0x{status:08X}).")
    finally:
        CloseHandle(h_proc)


def resume_pid(pid: int) -> None:
    if not IS_WINDOWS:
        raise RuntimeError("Este aplicativo de suspensão/retomada funciona apenas no Windows.")
    access = PROCESS_SUSPEND_RESUME | PROCESS_QUERY_LIMITED_INFORMATION
    h_proc = OpenProcess(access, False, pid)
    if not h_proc:
        raise PermissionError(_format_windows_error(f"Falha ao abrir o processo PID={pid}."))
    try:
        status = NtResumeProcess(h_proc)
        if status != 0:
            raise RuntimeError(f"NtResumeProcess falhou (NTSTATUS=0x{status:08X}).")
    finally:
        CloseHandle(h_proc)


# ---------------------------
# GUI
# ---------------------------


@dataclass(frozen=True)
class ProcRow:
    pid: int
    name: str
    exe: str
    user: str


class App(tk.Tk):
    def __init__(self) -> None:
        super().__init__()
        self.title("Win App Suspender")
        self.geometry("920x560")
        self.minsize(860, 520)

        self._rows: list[ProcRow] = []

        self._build_ui()
        self._refresh_async()

        if not IS_WINDOWS:
            messagebox.showwarning(
                "Aviso",
                "Você está executando fora do Windows.\n"
                "A listagem pode funcionar, mas suspender/retomar não.",
            )

    def _build_ui(self) -> None:
        top = ttk.Frame(self, padding=12)
        top.pack(side=tk.TOP, fill=tk.X)

        ttk.Label(top, text="Filtro (nome do processo):").pack(side=tk.LEFT)
        self.filter_var = tk.StringVar()
        filter_entry = ttk.Entry(top, textvariable=self.filter_var, width=32)
        filter_entry.pack(side=tk.LEFT, padx=(8, 8))
        filter_entry.bind("<Return>", lambda _e: self._refresh_async())

        ttk.Button(top, text="Atualizar", command=self._refresh_async).pack(side=tk.LEFT)

        ttk.Separator(self).pack(side=tk.TOP, fill=tk.X, padx=12, pady=(6, 6))

        mid = ttk.Frame(self, padding=(12, 6))
        mid.pack(side=tk.TOP, fill=tk.BOTH, expand=True)

        columns = ("pid", "name", "user", "exe")
        self.tree = ttk.Treeview(mid, columns=columns, show="headings", selectmode="extended")
        self.tree.heading("pid", text="PID")
        self.tree.heading("name", text="Processo")
        self.tree.heading("user", text="Usuário")
        self.tree.heading("exe", text="Caminho (exe)")

        self.tree.column("pid", width=70, anchor=tk.E)
        self.tree.column("name", width=190, anchor=tk.W)
        self.tree.column("user", width=170, anchor=tk.W)
        self.tree.column("exe", width=420, anchor=tk.W)

        vsb = ttk.Scrollbar(mid, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=vsb.set)

        self.tree.pack(side=tk.LEFT, fill=tk.BOTH, expand=True)
        vsb.pack(side=tk.RIGHT, fill=tk.Y)

        bot = ttk.Frame(self, padding=12)
        bot.pack(side=tk.BOTTOM, fill=tk.X)

        ttk.Button(bot, text="Suspender selecionados", command=self._suspend_selected_async).pack(
            side=tk.LEFT
        )
        ttk.Button(bot, text="Retomar selecionados", command=self._resume_selected_async).pack(
            side=tk.LEFT, padx=(8, 0)
        )

        ttk.Separator(bot, orient="vertical").pack(side=tk.LEFT, fill=tk.Y, padx=12)

        self.launch_path_var = tk.StringVar()
        ttk.Entry(bot, textvariable=self.launch_path_var, width=46).pack(side=tk.LEFT)
        ttk.Button(bot, text="Escolher .exe", command=self._pick_exe).pack(side=tk.LEFT, padx=(8, 0))

        ttk.Label(bot, text="Suspender após (s):").pack(side=tk.LEFT, padx=(12, 6))
        self.delay_var = tk.StringVar(value="2")
        ttk.Entry(bot, textvariable=self.delay_var, width=6).pack(side=tk.LEFT)

        ttk.Button(bot, text="Abrir e suspender", command=self._launch_and_suspend_async).pack(
            side=tk.LEFT, padx=(8, 0)
        )

        self.status_var = tk.StringVar(value="Pronto.")
        ttk.Label(self, textvariable=self.status_var, padding=(12, 0, 12, 12)).pack(
            side=tk.BOTTOM, fill=tk.X
        )

    # ---- process list ----
    def _refresh_async(self) -> None:
        self.status_var.set("Atualizando lista de processos...")
        threading.Thread(target=self._refresh, daemon=True).start()

    def _refresh(self) -> None:
        flt = (self.filter_var.get() or "").strip().lower()
        rows: list[ProcRow] = []

        for p in psutil.process_iter(attrs=["pid", "name", "exe", "username"]):
            try:
                info = p.info
                name = (info.get("name") or "").strip()
                if flt and flt not in name.lower():
                    continue
                rows.append(
                    ProcRow(
                        pid=int(info["pid"]),
                        name=name,
                        exe=info.get("exe") or "",
                        user=info.get("username") or "",
                    )
                )
            except (psutil.NoSuchProcess, psutil.AccessDenied):
                continue

        rows.sort(key=lambda r: (r.name.lower(), r.pid))

        def apply() -> None:
            self._rows = rows
            self.tree.delete(*self.tree.get_children())
            for r in rows:
                self.tree.insert("", tk.END, values=(r.pid, r.name, r.user, r.exe))
            self.status_var.set(f"Processos listados: {len(rows)}")

        self.after(0, apply)

    def _selected_pids(self) -> list[int]:
        pids: list[int] = []
        for item in self.tree.selection():
            vals = self.tree.item(item, "values")
            if vals:
                try:
                    pids.append(int(vals[0]))
                except ValueError:
                    pass
        return pids

    # ---- suspend/resume ----
    def _suspend_selected_async(self) -> None:
        pids = self._selected_pids()
        if not pids:
            messagebox.showinfo("Seleção", "Selecione ao menos um processo.")
            return
        threading.Thread(target=self._suspend_many, args=(pids,), daemon=True).start()

    def _resume_selected_async(self) -> None:
        pids = self._selected_pids()
        if not pids:
            messagebox.showinfo("Seleção", "Selecione ao menos um processo.")
            return
        threading.Thread(target=self._resume_many, args=(pids,), daemon=True).start()

    def _suspend_many(self, pids: list[int]) -> None:
        ok, failed = 0, []
        self.after(0, lambda: self.status_var.set(f"Suspendendo {len(pids)} processo(s)..."))
        for pid in pids:
            try:
                suspend_pid(pid)
                ok += 1
            except Exception as e:  # noqa: BLE001
                failed.append((pid, str(e)))
        self.after(0, lambda: self._show_result("Suspender", ok, failed))

    def _resume_many(self, pids: list[int]) -> None:
        ok, failed = 0, []
        self.after(0, lambda: self.status_var.set(f"Retomando {len(pids)} processo(s)..."))
        for pid in pids:
            try:
                resume_pid(pid)
                ok += 1
            except Exception as e:  # noqa: BLE001
                failed.append((pid, str(e)))
        self.after(0, lambda: self._show_result("Retomar", ok, failed))

    def _show_result(self, action: str, ok: int, failed: list[tuple[int, str]]) -> None:
        if failed:
            msg = f"{action}: sucesso em {ok}. Falhou em {len(failed)}.\n\n"
            msg += "\n".join([f"PID {pid}: {err}" for pid, err in failed[:12]])
            if len(failed) > 12:
                msg += f"\n... (+{len(failed)-12} erros)"
            messagebox.showwarning("Resultado", msg)
            self.status_var.set(f"{action}: {ok} ok, {len(failed)} falhas.")
        else:
            self.status_var.set(f"{action}: sucesso em {ok}.")

    # ---- launch exe ----
    def _pick_exe(self) -> None:
        path = filedialog.askopenfilename(
            title="Escolha um executável",
            filetypes=[("Executáveis", "*.exe"), ("Todos os arquivos", "*.*")],
        )
        if path:
            self.launch_path_var.set(path)

    def _launch_and_suspend_async(self) -> None:
        exe = (self.launch_path_var.get() or "").strip()
        if not exe:
            messagebox.showinfo("Abrir", "Escolha um .exe primeiro.")
            return
        if not os.path.exists(exe):
            messagebox.showerror("Abrir", "O caminho informado não existe.")
            return
        try:
            delay = float((self.delay_var.get() or "0").strip())
            if delay < 0:
                raise ValueError
        except ValueError:
            messagebox.showerror("Abrir", "Informe um número válido para o atraso (segundos).")
            return

        threading.Thread(target=self._launch_and_suspend, args=(exe, delay), daemon=True).start()

    def _launch_and_suspend(self, exe: str, delay: float) -> None:
        self.after(0, lambda: self.status_var.set("Abrindo aplicativo..."))
        try:
            proc = subprocess.Popen([exe])  # noqa: S603,S607
        except Exception as e:  # noqa: BLE001
            self.after(0, lambda: messagebox.showerror("Abrir", str(e)))
            self.after(0, lambda: self.status_var.set("Falha ao abrir."))
            return

        self.after(0, lambda: self.status_var.set(f"Aguardando {delay:.1f}s para suspender (PID {proc.pid})..."))
        time.sleep(delay)
        try:
            suspend_pid(proc.pid)
        except Exception as e:  # noqa: BLE001
            self.after(0, lambda: messagebox.showwarning("Suspender", f"Falha ao suspender PID {proc.pid}: {e}"))
            self.after(0, lambda: self.status_var.set("Falha ao suspender."))
            return

        self.after(0, lambda: self.status_var.set(f"Suspenso: PID {proc.pid}"))
        self.after(0, self._refresh_async)


def main() -> None:
    app = App()
    app.mainloop()


if __name__ == "__main__":
    main()

