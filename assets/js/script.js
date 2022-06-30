let books = [];
const RENDER_EVENT = "book-render";
const STORAGE_KEY = "books";

function addBook(t) {
  t.preventDefault();
  const title = document.querySelector("#inputTitle");
  const author = document.querySelector("#inputAuthor");
  const year = document.querySelector("#inputYear");
  const isComplete = document.querySelector("#inputIsComplete");
  const book = {
    id: +new Date(),
    title: title.value,
    author: author.value,
    year: year.value,
    isComplete: isComplete.checked,
  };
  books.push(book);
  t.target.reset();
  document.dispatchEvent(new Event(RENDER_EVENT));
}
function searchBook(e) {
  e.preventDefault();
  const search = document.querySelector("#searchTitle");
  (query = search.value),
    query
      ? newBook(
          books.filter((e) => {
            return e.title.toLowerCase().includes(query.toLowerCase());
          })
        )
      : newBook(books);
}
function newBook(book) {
  const rackNew = document.querySelector("#continueReading");
  const rackDone = document.querySelector("#completeReading");
  (rackNew.innerHTML = ""), (rackDone.innerHTML = "");
  for (const item of book) {
    const article = document.createElement("article");
    article.classList.add("book_item");
    article.setAttribute("id", `book-${book.id}`);
    const title = document.createElement("h3");
    title.innerText = item.title;
    const author = document.createElement("p");
    author.innerText = "Penulis: " + item.author;
    const year = document.createElement("p");
    year.innerText = "Tahun: " + item.year;
    if ((article.append(title, author, year), item.isComplete)) {
      const container = document.createElement("div");
      container.classList.add("action");
      const done = document.createElement("button");
      (done.id = item.id),
        done.classList.add("revision"),
        (done.innerHTML = `<span class="tooltip">Belum selesai dibaca</span>`),
        done.addEventListener("click", incompleteBook);

      const remove = document.createElement("button");
      (remove.id = item.id),
        remove.classList.add("delete"),
        (remove.innerHTML = `<span class="tooltip">Hapus buku</span>`),
        remove.addEventListener("click", removeBook),
        container.append(remove, done),
        article.append(container),
        rackDone.append(article);
    } else {
      const container = document.createElement("div");
      container.classList.add("action");
      const done = document.createElement("button");
      (done.id = item.id),
        done.classList.add("complete"),
        (done.innerHTML = `<span class="tooltip">Selesai dibaca</span>`),
        done.addEventListener("click", completeBook);
      const remove = document.createElement("button");
      (remove.id = item.id),
        remove.classList.add("delete"),
        (remove.innerHTML = `<span class="tooltip">Hapus buku</span>`),
        remove.addEventListener("click", removeBook),
        container.appendChild(remove),
        container.appendChild(done),
        article.appendChild(container),
        rackNew.appendChild(article);
    }
  }
}
function completeBook(e) {
  const target = Number(e.target.id),
    data = books.findIndex((e) => {
      return e.id === target;
    });
  -1 !== data &&
    Swal.fire({
      title: "Apa kau yakin?",
      text: "Buku akan diubah menjadi selesai dibaca!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, ubah!",
      cancelButtonText: "Batalkan",
    }).then((result) => {
      if (result.isConfirmed) {
        (books[data] = { ...books[data], isComplete: true }),
          document.dispatchEvent(new Event(RENDER_EVENT));
        Swal.fire("Berhasil!", "Buku berhasil diubah!", "success");
      }
    });
}
function incompleteBook(e) {
  const target = Number(e.target.id);
  const data = books.findIndex((e) => {
    return e.id === target;
  });
  -1 !== data &&
    Swal.fire({
      title: "Apa kau yakin?",
      text: "Buku akan dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, kembalikan!",
      cancelButtonText: "Batalkan",
    }).then((result) => {
      if (result.isConfirmed) {
        (books[data] = { ...books[data], isComplete: !1 }),
          document.dispatchEvent(new Event(RENDER_EVENT));
        Swal.fire("Berhasil!", "Buku berhasil dikembalikan!", "success");
      }
    });
}
function removeBook(e) {
  const target = Number(e.target.id);
  const data = books.findIndex((e) => {
    return e.id === target;
  });
  -1 !== data &&
    Swal.fire({
      title: "Apa kau yakin?",
      text: "Buku tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batalkan",
    }).then((result) => {
      if (result.isConfirmed) {
        books.splice(data, 1), document.dispatchEvent(new Event(RENDER_EVENT));
        Swal.fire("Berhasil!", "Buku berhasil dihapus!", "success");
      }
    });
}
function saveBook() {
  !(function (e) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(e));
  })(books),
    newBook(books);
}
window.addEventListener("DOMContentLoaded", () => {
  (books = JSON.parse(localStorage.getItem(STORAGE_KEY)) || []), newBook(books);
  const inputForm = document.querySelector("#inputBook"),
    inputSearch = document.querySelector("#searchBook");
  inputForm.addEventListener("submit", addBook),
    inputSearch.addEventListener("submit", searchBook),
    document.addEventListener(RENDER_EVENT, saveBook);
});
