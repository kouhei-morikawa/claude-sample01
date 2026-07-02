# サンプル06：リストのレンダリング

## 何を学ぶか

- **map()** で配列をリスト表示する方法
- **key** の役割と正しい指定方法
- **filter() + map()** を組み合わせた絞り込み表示
- state の配列を **安全に更新** する方法

---

## コードの解説

### map() でリストを描画

配列の各要素を JSX に変換するには `.map()` を使います。

```tsx
const items = ['りんご', 'みかん', 'ぶどう']

return (
  <ul>
    {items.map(item => (
      <li key={item}>{item}</li>
    ))}
  </ul>
)
```

### key は必須

`key` は React がリストの変化を効率よく検出するための属性です。

```tsx
// ✅ OK：安定した一意の値（IDなど）を使う
{fruits.map(fruit => <FruitItem key={fruit.id} fruit={fruit} />)}

// ⚠️ 避けたい：インデックスは要素の追加・削除・並び替えで問題が起きやすい
{fruits.map((fruit, index) => <FruitItem key={index} fruit={fruit} />)}
```

**key の条件：**
- 同じリスト内で**一意**であること
- レンダリングをまたいで**安定**していること（変化しないこと）

### filter() で絞り込む

```tsx
// 'tropical' カテゴリだけ表示
const tropicalFruits = fruits.filter(f => f.category === 'tropical')
```

### state の配列を更新する

配列を直接変更してはいけません — 必ず**新しい配列**を返します。

```tsx
// ❌ NG：元の配列を直接変更している
fruits.push(newFruit)
setFruits(fruits)

// ✅ OK：スプレッド演算子で新しい配列を作る
setFruits([...fruits, newFruit])

// ✅ OK：filter で要素を削除（元の配列は変更されない）
setFruits(fruits.filter(f => f.id !== targetId))
```

---

## 確認問題

1. フルーツの追加フォームを作って、リストに新しいフルーツを追加できるようにしましょう
2. 価格が 200 円以下のフルーツだけ表示するフィルターを追加しましょう
3. インデックスを `key` に使ったとき、削除後にどんな問題が起きるか試してみましょう
