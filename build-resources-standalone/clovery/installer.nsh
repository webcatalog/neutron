# add registry to define Clovery as browser and mail client on Windows 10+
# rewritten in NSH from https://github.com/minbrowser/min/blob/master/main/registryConfig.js
# fix https://github.com/webcatalog/webcatalog-app/issues/784
# useful doc https://github.com/electron-userland/electron-builder/issues/837#issuecomment-614127460
# useful doc https://www.electron.build/configuration/nsis#custom-nsis-script

!macro customInstall
  WriteRegStr HKCU 'Software\RegisteredApplications' 'Clovery' 'Software\Clients\StartMenuInternet\Clovery\Capabilities'
  WriteRegStr HKCU 'Software\Classes\Clovery' '' 'Clovery Browser Document'
  WriteRegStr HKCU 'Software\Classes\Clovery\Application' 'ApplicationIcon' '$appExe,0'
  WriteRegStr HKCU 'Software\Classes\Clovery\Application' 'ApplicationName' 'Clovery'
  WriteRegStr HKCU 'Software\Classes\Clovery\Application' 'AppUserModelId' 'Clovery'
  WriteRegStr HKCU 'Software\Classes\Clovery\DefaulIcon' 'ApplicationIcon' '$appExe,0'
  WriteRegStr HKCU 'Software\Classes\Clovery\shell\open\command' '' '"$appExe" "%1"'
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\Capabilities\StartMenu' 'StartMenuInternet' 'Clovery'
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\Capabilities\URLAssociations' 'http' 'Clovery'
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\Capabilities\URLAssociations' 'https' 'Clovery'
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\Capabilities\URLAssociations' 'mailto' 'Clovery'
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\Capabilities\URLAssociations' 'webcal' 'Clovery'
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\DefaultIcon' '' '$appExe,0'
  WriteRegDWORD HKCU 'Software\Clients\StartMenuInternet\Clovery\InstallInfo' 'IconsVisible' 1
  WriteRegStr HKCU 'Software\Clients\StartMenuInternet\Clovery\shell\open\command' '' '$appExe'
!macroend

!macro customUnInstall
  DeleteRegValue HKCU 'Software\RegisteredApplications' 'Clovery'
  DeleteRegKey HKCU 'Software\Classes\Clovery'
  DeleteRegKey HKCU 'Software\Clients\StartMenuInternet\Clovery'
!macroend