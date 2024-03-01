Vue.createApp({
  data() {
    return {
      counter: 0,
      items: [],
      divs: [],
    };
  },
  methods: {
    onInput(e, item) {
      item.value = e.target.innerText;
    },
    onTab(item, index) {
      if (index === 0) return;
      if (this.items[index - 1].indent < item.indent) return;
      item.indent++;
    },
    onTabShift(item, index) {
      if (item.indent <= 1) return;
      item.indent--;

      for (let i = index + 1; i < this.items.length; i++) {
        if (this.items[i - 1].indent + 2 !== this.items[i].indent) break;
        this.items[i].indent--;
      }
    },
    onDown(index) {
      this.selectItem(index + 1);
    },
    onUp(index) {
      this.selectItem(index - 1);
    },
    onEnter(item, index) {
      const newItem = {
        id: this.counter,
        value: "item-" + this.counter,
        indent: Math.max(1, item.indent),
      };
      this.items.splice(index + 1, 0, newItem);
      this.counter++;

      this.$nextTick(function () {
        this.selectItem(index + 1);
      });
    },
    onBackspace: function (item, index) {
      if (index == 0) return;
      if (item.value != "") return;
      item.indent--;

      for (let i = index + 1; i < this.items.length; i++) {
        if (this.items[i - 1].indent + 2 !== this.items[i].indent) break;
        this.items[i].indent--;
      }
      this.items.splice(index, 1);
      this.getDiv(index - 1).focus();
    },
    selectItem(index) {
      if (index < 0 || index >= this.items.length) return;

      const el = this.getDiv(index);
      el.focus();
      let range = document.createRange();
      range.selectNodeContents(el);
      let sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    },
    getDiv(index) {
      return this.divs[this.items[index].id];
    },
    deleteList() {
      this.items = [
        { id: 0, value: "root", indent: 0 },
        { id: 1, value: "item-1", indent: 1 },
      ];
      this.counter = this.items.length;
    },
  },
  //   computed: {
  //     tree() {
  //   let parents = [0];
  //   let items = this.items;

  //   for (let i = 1; i < items.length; i++) {
  //     parents[items[i].indent] = i;
  //     items[i].parent = parents[items[i].indent - 1];
  //     items[items[i].parent].lastChild = i;
  //   }

  //   let prefix = "";
  //   let lines = [items[0].value];

  //   for (let i = 1; i < items.length; i++) {
  //     let parentIndex = items[i].parent;

  //     if (items[i].indent > 1) {
  //       prefix = prefix.slice(0, (items[i].indent - 2) * 4);
  //       if (items[items[parentIndex].parent].lastChild === parentIndex) {
  //         prefix += "    ";
  //       } else {
  //         prefix += "│   ";
  //       }
  //     } else {
  //       prefix = "";
  //     }
  //     lines[i] = prefix;

  //     if (items[parentIndex].lastChild === i) {
  //       lines[i] += "└── ";
  //     } else {
  //       lines[i] += "├── ";
  //     }
  //     lines[i] += items[i].value;
  //   }

  //   return lines.join("\n");

  // 参考サイトのコードが動作しないため、chatGPTにより下記生成
  computed: {
    tree() {
      const lines = this.items.map((item, index) => {
        // インデントのプレフィックスを作成
        const prefix = " ".repeat(item.indent * 4);

        // 最後の兄弟要素かどうかを判断
        const isLastSibling =
          index === this.items.length - 1 ||
          this.items[index + 1].indent <= item.indent;

        // ノード接続記号
        const connector = isLastSibling ? "└── " : "├── ";

        // 現在の項目のプレフィックスと値を組み合わせる
        return `${prefix}${connector}${item.value}`;
      });

      return lines.join("\n");
    },
  },

  created() {
    this.items = [
      { id: 0, value: "list2tree", indent: 0 },
      { id: 1, value: "使い方", indent: 1 },
      { id: 2, value: "クリックで、編集", indent: 2 },
      { id: 3, value: "上下キーで、フォーカス移動", indent: 2 },
      { id: 4, value: "Enterで、新規追加", indent: 2 },
      { id: 5, value: "Tab / Shift+Tab で階層移動", indent: 2 },
      { id: 6, value: "Backspace(空欄時)で削除", indent: 2 },
      { id: 7, value: "How to", indent: 1 },
      { id: 8, value: "Click to edit", indent: 2 },
      { id: 9, value: "Up / Down to move focus", indent: 2 },
      { id: 10, value: "Enter to add new item", indent: 2 },
      { id: 11, value: "Tab / Shift+Tab to move right", indent: 2 },
      { id: 12, value: "Backspace in empty item to delete", indent: 2 },
    ];
    this.counter = this.items.length;
    this.$nextTick(function () {
      this.selectItem(0);
    });
  },
}).mount("#app");
