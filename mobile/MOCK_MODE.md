# 🎭 Mock Mode - Prototip Geliştirme Rehberi

Bu doküman, Kalendos mobil uygulamasının **Mock Mode** (Sahte Veri Modu) ile nasıl çalıştırılacağını açıklar.

## 📋 İçindekiler

- [Mock Mode Nedir?](#mock-mode-nedir)
- [Nasıl Kullanılır?](#nasıl-kullanılır)
- [Mevcut Mock Datalar](#mevcut-mock-datalar)
- [Canlıya Geçiş](#canlıya-geçiş)

---

## 🎯 Mock Mode Nedir?

Mock Mode, uygulamanın **gerçek Shopify API'si olmadan** çalışmasını sağlar. Bu mod:

✅ Prototip geliştirme için idealdir
✅ Yöneticiye demo yapmak için uygundur
✅ Gerçek API kodlarını korur (silmez)
✅ İstediğiniz zaman canlıya geçebilirsiniz

---

## 🚀 Nasıl Kullanılır?

### 1. Mock Mode'u Aktif Et

`.env` dosyasını açın ve şu satırı kontrol edin:

```bash
USE_MOCK_DATA=true
```

✅ **Şu an zaten mock mode aktif!**

### 2. Test Kullanıcısı ile Giriş Yap

Uygulamada giriş yaparken şu bilgileri kullanın:

- **E-posta:** `test@kalendos.com`
- **Şifre:** `Test123!`

### 3. Uygulamayı Başlat

```bash
npx expo start
```

---

## 📦 Mevcut Mock Datalar

### Ürünler (6 adet tropikal meyve)

1. **Mango (Tropikal)** - 45.00 ₺
2. **Ananas** - 35.00 ₺
3. **Dragon Fruit (Ejder Meyvesi)** - 60.00 ₺
4. **Papaya** - 40.00 ₺
5. **Hindistan Cevizi** - 25.00 ₺
6. **Passion Fruit** - 55.00 ₺

### Kategoriler (3 adet)

- Tüm Ürünler
- Popüler Ürünler
- Yeni Ürünler

### Test Kullanıcı Bilgileri

- **Ad Soyad:** Test Kullanıcı
- **E-posta:** test@kalendos.com
- **Telefon:** +90 555 123 4567
- **Adres:** Örnek Mahallesi, Tropikal Sokak No:1, Daire 5, İstanbul

### Sipariş Geçmişi

1 adet örnek sipariş:
- **Sipariş No:** #1001
- **Toplam:** 125.00 ₺
- **Durum:** Teslim Edildi
- **Ürünler:** 2x Mango, 1x Ananas

---

## 🎨 Mock Mode Özellikleri

### ✅ Çalışan Özellikler

- ✅ Ürün listeleme ve detay sayfası
- ✅ Kategori görüntüleme
- ✅ Ürün arama (Türkçe karakter desteği ile)
  - Örnek: "anans" yazarak "Ananas" bulabilirsiniz
- ✅ Kullanıcı girişi (test@kalendos.com)
- ✅ Profil görüntüleme
- ✅ Adres listesi
- ✅ Sipariş geçmişi
- ✅ Favoriler

### ⚠️ Kısıtlı Özellikler

Mock mode'da şu özellikler **simüle edilir** (gerçek işlem yapmaz):

- Sepete ürün ekleme (yerel olarak saklanır)
- Ödeme (gerçek ödeme yapılmaz)
- Adres ekleme/düzenleme (yerel olarak saklanır)
- Sipariş oluşturma (simüle edilir)

---

## 🌐 Canlıya Geçiş

Prototip beğenildiğinde ve Shopify mağazanız hazır olduğunda:

### 1. Shopify Token'ları Alın

Shopify Admin panelinden:
- Storefront API Access Token
- Store Domain

### 2. `.env` Dosyasını Güncelleyin

```bash
# Mock Mode'u kapat
USE_MOCK_DATA=false

# Shopify bilgilerini gir
SHOPIFY_STORE_DOMAIN=kalendos.myshopify.com
SHOPIFY_STOREFRONT_API_URL=https://kalendos.myshopify.com/api/2024-01/graphql.json
SHOPIFY_STOREFRONT_ACCESS_TOKEN=shpat_xxxxxxxxxxxxxxxxxxxxxxxx
```

### 3. Uygulamayı Yeniden Başlat

```bash
npx expo start --clear
```

✅ **Artık gerçek Shopify API'si ile çalışıyorsunuz!**

---

## 🔧 Teknik Detaylar

### Mock Mode Kontrolü

Uygulama merkezi bir config dosyası kullanır:

**Dosya:** `src/config/mockMode.ts`

```typescript
export const IS_MOCK_MODE =
  USE_MOCK_DATA === 'true' ||
  !SHOPIFY_STOREFRONT_ACCESS_TOKEN ||
  SHOPIFY_STOREFRONT_ACCESS_TOKEN.trim() === '';
```

### Mock Mode Kullanan Hook'lar

Tüm hook'lar mock mode desteği ile geliştirildi:

- ✅ `useProducts` - Ürünler
- ✅ `useSearchProducts` - Arama
- ✅ `useCollections` - Kategoriler
- ✅ `useCustomer` - Müşteri bilgileri
- ✅ `useAuth` - Giriş/Kayıt
- ✅ `useOrders` - Siparişler
- ✅ `useCart` - Sepet (kısmen)

### Mock Data Dosyası

**Dosya:** `src/shopify/mockData.ts`

Bu dosyada tüm sahte veriler tanımlanmıştır. İhtiyaç duyarsanız:

- Yeni ürünler ekleyebilirsiniz
- Kategorileri düzenleyebilirsiniz
- Test kullanıcı bilgilerini değiştirebilirsiniz

---

## 📞 Destek

Sorularınız için:
- **Geliştirici:** [İletişim bilgisi]
- **Proje:** Kalendos Mobil Uygulama
- **Versiyon:** 1.0.0 (Prototip)

---

## 📝 Notlar

- Mock mode'da tüm veriler **cihazda** saklanır
- Gerçek API kodları **korunur** ve silinmez
- Canlıya geçiş **5 dakikadan az** sürer
- Prototip için **%100 fonksiyonel**

---

**🎉 İyi çalışmalar!**

*Bu dokümantasyon Claude Code tarafından otomatik oluşturulmuştur.*
