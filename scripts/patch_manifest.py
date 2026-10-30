# Deixa o app aparecer no menu das Android TV / TV box e funcionar sem tela de toque.
import sys,re
p='android/app/src/main/AndroidManifest.xml'
s=open(p,encoding='utf-8').read()
if 'LEANBACK_LAUNCHER' in s: print('já ajustado'); sys.exit(0)
n=0
s,k=re.subn(r'(<category android:name="android.intent.category.LAUNCHER"\s*/>)',r'\1\n                <category android:name="android.intent.category.LEANBACK_LAUNCHER" />',s,count=1);n+=k
s,k=re.subn(r'<application',('<uses-feature android:name="android.software.leanback" android:required="false" />\n'
  '    <uses-feature android:name="android.hardware.touchscreen" android:required="false" />\n'
  '    <application\n        android:banner="@drawable/tv_banner"'),s,count=1);n+=k
if n!=2: sys.exit('ERRO: não consegui ajustar o AndroidManifest.xml (n=%d)'%n)
open(p,'w',encoding='utf-8').write(s);print('AndroidManifest ajustado para TV')
