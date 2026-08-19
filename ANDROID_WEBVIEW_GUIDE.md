# Panduan Integrasi Android WebView: Servisin SaaS

Aplikasi web **Servisin** didesain secara khusus *mobile-first* agar dapat di-embed langsung ke dalam aplikasi **Android Native (Kotlin/Java)** menggunakan `WebView` dengan performa tinggi, tampilan bebas distorsi, dan dukungan upload foto nota/kendaraan.

---

## 1. Konfigurasi `AndroidManifest.xml`

Tambahkan izin internet dan konfigurasi cleartext (jika testing via IP lokal `http://192.168.x.x`):

```xml
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.example.servisinapp">

    <!-- Izin Akses Internet & Kamera/File -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" android:maxSdkVersion="32" />
    <uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
    <uses-permission android:name="android.permission.CAMERA" />

    <application
        android:allowBackup="true"
        android:icon="@mipmap/ic_launcher"
        android:label="Servisin"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.Servisin"
        android:usesCleartextTraffic="true"> <!-- true untuk HTTP lokal, false saat HTTPS produksi -->

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
```

---

## 2. Layout XML (`activity_main.xml`)

```xml
<?xml version="1.0" encoding="utf-8"?>
<androidx.coordinatorlayout.widget.CoordinatorLayout
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    android:background="#F8FAFC">

    <WebView
        android:id="@+id/webView"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.coordinatorlayout.widget.CoordinatorLayout>
```

---

## 3. Implementasi Kotlin (`MainActivity.kt`)

Kode lengkap dengan penanganan **File Chooser / Upload Kamera & Galeri** untuk upload foto nota:

```kotlin
package com.example.servisinapp

import android.annotation.SuppressLint
import android.app.Activity
import android.content.Intent
import android.net.Uri
import android.os.Bundle
import android.webkit.*
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity

class MainActivity : AppCompatActivity() {

    private lateinit var webView: WebView
    private var filePathCallback: ValueCallback<Array<Uri>>? = null

    // Activity Result Launcher untuk File Chooser (Upload Foto)
    private val fileChooserLauncher = registerForActivityResult(
        ActivityResultContracts.StartActivityForResult()
    ) { result ->
        if (result.resultCode == Activity.RESULT_OK) {
            val data = result.data
            val results: Array<Uri>? = when {
                data?.dataString != null -> arrayOf(Uri.parse(data.dataString))
                data?.clipData != null -> {
                    val count = data.clipData!!.itemCount
                    Array(count) { i -> data.clipData!!.getItemAt(i).uri }
                }
                else -> null
            }
            filePathCallback?.onReceiveValue(results)
        } else {
            filePathCallback?.onReceiveValue(null)
        }
        filePathCallback = null
    }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        webView = findViewById(R.id.webView)

        val settings = webView.settings
        settings.javaScriptEnabled = true
        settings.domStorageEnabled = true
        settings.databaseEnabled = true
        settings.loadWithOverviewMode = true
        settings.useWideViewPort = true
        settings.allowFileAccess = true
        settings.allowContentAccess = true
        settings.setSupportZoom(false)
        settings.builtInZoomControls = false

        // Custom User Agent (Opsional)
        settings.userAgentString = settings.userAgentString + " ServisinApp/1.0.0"

        webView.webViewClient = object : WebViewClient() {
            override fun shouldOverrideUrlLoading(view: WebView?, request: WebResourceRequest?): Boolean {
                val url = request?.url?.toString() ?: return false
                // Buka link WhatsApp / Telp langsung di aplikasi native
                if (url.startsWith("whatsapp:") || url.startsWith("tel:") || url.startsWith("mailto:")) {
                    val intent = Intent(Intent.ACTION_VIEW, Uri.parse(url))
                    startActivity(intent)
                    return true
                }
                return false
            }
        }

        webView.webChromeClient = object : WebChromeClient() {
            // Tangani <input type="file"> dari React untuk foto nota/kendaraan
            override fun onShowFileChooser(
                webView: WebView?,
                filePathCallback: ValueCallback<Array<Uri>>?,
                fileChooserParams: FileChooserParams?
            ): Boolean {
                this@MainActivity.filePathCallback?.onReceiveValue(null)
                this@MainActivity.filePathCallback = filePathCallback

                val intent = Intent(Intent.ACTION_GET_CONTENT).apply {
                    addCategory(Intent.CATEGORY_OPENABLE)
                    type = "image/*"
                }
                fileChooserLauncher.launch(Intent.createChooser(intent, "Pilih Foto"))
                return true
            }
        }

        // Ganti dengan IP lokal laptop Anda saat dev atau URL Domain Produksi
        // Contoh saat dev: http://192.168.1.10:5173
        webView.loadUrl("http://10.0.2.2:5173") // 10.0.2.2 untuk Android Emulator bawaan
    }

    // Tombol Back Android untuk navigasi history WebView
    override fun onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack()
        } else {
            super.onBackPressed()
        }
    }
}
```

---

## 4. Tips Testing di HP Fisik Android

1. Pastikan HP Android dan Laptop terhubung ke **Wi-Fi yang sama**.
2. Cek IP lokal laptop Anda via PowerShell: `ipconfig` (misal: `192.168.1.25`).
3. Jalankan `npm run dev` pada proyek Servisin.
4. Buka browser Chrome di HP Android: `http://192.168.1.25:5173` atau load IP tersebut di WebView Android Studio.
