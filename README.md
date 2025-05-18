# mokumoku

## 資料一覧

- [250518_genspark_slide](https://kumes.github.io/mokumoku/250518_genspark_slide)

- [250518_WebDev](https://kumes.github.io/mokumoku/250518_WebDev/)

## AI スライド活用

1. [ChatGPT](https://chatgpt.com/) の o3 で、基本的な情報を調査してまとめる。

（プロンプト例）
```
Gensparkの概要を説明する、スライド5枚を作成したいです。ウェブ情報を調査して、内容をまとめてください。スライドの構成は以下の通りです。

（スライド1）Gensparkの概要説明
（スライド2）Gensparkの各種基本機能やエージェント機能の説明
（スライド3）GensparkスーパーAIエージェントの機能説明
（スライド4）AIスライドの機能説明
（スライド5）Gensparkの今後の機能開発の概要とタイムライン
```

2. [Genspark](https://www.genspark.ai/) AI スライドで、スライド作成

（プロンプト例）
```
gensparkの概要を説明する、クールデザインのスライド5枚を作成してください。
スライドサイズは、16:9のサイズ、10インチ x 5.625インチに設定してください。
スライド内容の概要は下記の通りです。

---

(o3での調査結果を貼り付ける)

```

※ Bug-fixのときは、GPT-4.1 が使えるかも...(調査中)

3. 各htmlの末尾に、js script行を追記する。

```
    <script defer src="./slide-nav.js"></script>
</body>
</html>
```
