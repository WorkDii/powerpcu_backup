[Setup]
AppName=PowerPCU-Backup
AppVersion=2.0
WizardStyle=modern
DefaultDirName={autopf}\PowerPCU-Backup
DefaultGroupName=PowerPCU-Backup
OutputDir=userdocs:Inno Setup Examples Output
DisableDirPage=no
DisableProgramGroupPage=yes
UninstallDisplayIcon={app}\power_pcu_backup.exe
UninstallDisplayName=PowerPCU-Backup
Uninstallable=yes

[Icons]
Name: "{group}\PowerPCU-Backup"; Filename: "{app}\power_pcu_backup.exe"
Name: "{group}\Uninstall PowerPCU-Backup"; Filename: "{uninstallexe}"
[Code]
var
  DownloadPage: TDownloadWizardPage;

function OnDownloadProgress(const Url, FileName: String; const Progress, ProgressMax: Int64): Boolean;
begin
  if Progress = ProgressMax then
    Log(Format('Successfully downloaded file to {tmp}: %s', [FileName]));
  Result := True;
end;

procedure InitializeWizard;
begin
  DownloadPage := CreateDownloadPage(SetupMessage(msgWizardPreparing), SetupMessage(msgPreparingDesc), @OnDownloadProgress);
  DownloadPage.ShowBaseNameInsteadOfUrl := True;
end;

function NextButtonClick(CurPageID: Integer): Boolean;
begin
  if CurPageID = wpReady then begin
    DownloadPage.Clear;
    DownloadPage.Add('https://powerpcu.com/backup/download', 'power_pcu_backup.zip', '');
    DownloadPage.Show;
    try
      try
        DownloadPage.Download; // This downloads the files to {tmp}
        Result := True;
      except
        if DownloadPage.AbortedByUser then
          Log('Aborted by user.')
        else
          SuppressibleMsgBox(AddPeriod(GetExceptionMessage), mbCriticalError, MB_OK, IDOK);
        Result := False;
      end;
    finally
      DownloadPage.Hide;
    end;
  end else
    Result := True;
end;

function OpenFolderOrWebsite(Param: string): string;
var
  ErrorCode: Integer;
begin
  ShellExec('open', Param, '', '', SW_SHOWNORMAL, ewNoWait, ErrorCode);
  Result := '';
end;

// Uninstall code
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
var
  mRes : integer;
  ResultCode: Integer;
begin
  case CurUninstallStep of
    usUninstall:
      begin
        // Stop and delete the service
        Exec(ExpandConstant('{sys}\sc.exe'), 'stop power_pcu_backup', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
        Exec(ExpandConstant('{sys}\sc.exe'), 'delete power_pcu_backup', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
        
        mRes := MsgBox('Do you want to remove all user data?', mbConfirmation, MB_YESNO or MB_DEFBUTTON2)
        if mRes = IDYES then
        begin
          DelTree(ExpandConstant('{app}\UserData'), True, True, True);
        end;
      end;
    usPostUninstall:
      begin
        if DirExists(ExpandConstant('{app}')) then
        begin
          if MsgBox('Do you want to remove the installation directory?', mbConfirmation, MB_YESNO or MB_DEFBUTTON2) = IDYES then
          begin
            DelTree(ExpandConstant('{app}'), True, True, True);
          end;
        end;
      end;
  end;
end;

[UninstallDelete]
Type: filesandordirs; Name: "{app}"

[Run]
Filename: "powershell.exe"; Parameters: "-NoProfile -ExecutionPolicy Bypass -Command ""Expand-Archive -Path '{tmp}\power_pcu_backup.zip' -DestinationPath '{app}' -Force"""; Flags: runhidden
Filename: "{cmd}"; Parameters: "/c start """" ""{app}"""; Flags: nowait postinstall skipifsilent; Description: "Open installation folder"