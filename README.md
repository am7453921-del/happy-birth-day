# الموقع جاهز — الخطوات اللي بعدها

## 1) عاين الموقع دلوقتي
افتح ملف `index.html` بأي متصفح (دبل كليك عليه) وشوفه زي ما هيبقى بالظبط.

## 2) عدّل المحتوى
افتح `content.js` بس. كل مكان مكتوب `(اكتب هنا)` استبدله بالنص. مفيش داعي تلمس أي ملف تاني.

## 3) ضيف الصور والأغنية
- الصور: حطها جوه فولدر `images/` واكتب المسار في `content.js` (مثلاً `images/1.jpg`)
- الأغنية: حطها جوه فولدر `audio/` واكتب المسار في `content.js` (مثلاً `audio/song.mp3`)

## 4) ارفعه على GitHub
جهّز حساب GitHub وريبو (Private أفضل) زي ما اتفقنا، وبعدين من داخل فولدر المشروع:

```
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin <رابط الريبو بتاعك>
git push -u origin main
```

لو عايز تنشره كموقع فعلي بلينك تبعتهولها (مش مجرد ملفات)، أسهل حاجة **GitHub Pages** (مجاني):
Settings → Pages → Source: اختار branch `main` → Save. هيديك لينك زي:
`https://username.github.io/repo-name/`
