let books = [];
const RENDER_EVENT = "book-render";
const STORAGE_KEY = "books";
const SAVED_EVENT = "book-saved";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#inputBook");
  const search = document.querySelector("#searchBook");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    addBook();
    e.target.reset();
  });
  search.addEventListener("submit", searchBook);

  if (isStorageExist()) {
    loadFromStorage();
  }
});

document.addEventListener(RENDER_EVENT, () => {
  const notDoneBookList = document.getElementById("continueReading");
  notDoneBookList.innerHTML = "";

  const doneBookList = document.getElementById("completeReading");
  doneBookList.innerHTML = "";

  const text = document.createElement("p");
  text.innerText = "belum ada buku";

  const article = document.createElement("article");
  article.classList.add("empty_list");
  article.append(text);

  for (const book of books) {
    const bookElement = newBook(book);
    if (book.isComplete === 0) {
      doneBookList.append(article);
    } else if (!book.isComplete === 0) {
      notDoneBookList.append(article);
    }
    if (book.isComplete) {
      doneBookList.append(bookElement);
    } else {
      notDoneBookList.append(bookElement);
    }
  }
});

function addBook() {
  const title = document.querySelector("#inputTitle").value;
  const author = document.querySelector("#inputAuthor").value;
  const year = document.querySelector("#inputYear").value;
  const isComplete = document.querySelector("#inputIsComplete").checked;
  const id = +new Date();
  const book = generateBook(id, title, author, year, isComplete);

  books.push(book);
  document.dispatchEvent(new Event(RENDER_EVENT));

  saveBook();
}

function generateBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function searchBook(t) {
  t.preventDefault();
  const search = document.querySelector("#searchTitle");
  (query = search.value),
    query
      ? newBook(
          books.filter((e) =>
            e.title.toLowerCase().includes(query.toLowerCase())
          )
        )
      : newBook(books);
}

function newBook(book) {
  const article = document.createElement("article");
  article.classList.add("book_item");

  const title = document.createElement("h3");
  title.innerText = book.title;

  const author = document.createElement("p");
  author.innerText = "Penulis: " + book.author;

  const year = document.createElement("p");

  year.innerText = "Tahun: " + book.year;

  article.append(title, author, year);
  article.setAttribute("id", `book-${book.id}`);

  if (book.isComplete) {
    const container = document.createElement("div");
    container.classList.add("action");

    const remove = document.createElement("button");
    remove.classList.add("delete");
    remove.innerHTML = `<i class="bx bx-trash"></i> <span class="tooltip">Hapus buku</span>`;

    const done = document.createElement("button");
    done.classList.add("complete");
    done.innerHTML = `<i class="bx bx-revision"></i> <span class="tooltip">Belum selesai membaca</span>`;

    done.addEventListener("click", () => {
      notDoneBook(book.id);
    });

    remove.addEventListener("click", () => {
      removeBook(book.id);
    });

    container.append(remove, done);
    article.append(container);
  } else {
    const container = document.createElement("div");
    container.classList.add("action");

    const done = document.createElement("button");
    done.classList.add("complete");
    done.innerHTML = `<i class="bx bx-check"></i> <span class="tooltip">Selesai membaca</span>`;

    done.addEventListener("click", () => {
      doneBook(book.id);
    });

    const remove = document.createElement("button");
    remove.classList.add("delete");
    remove.innerHTML = `<i class="bx bx-trash"></i> <span class="tooltip">Hapus buku</span>`;

    remove.addEventListener("click", () => {
      removeBook(book.id);
    });

    container.append(remove, done);
    article.append(container);
  }

  return article;
}

function doneBook(id) {
  const target = findBook(id);
  if (target == null) return;
  target.isComplete = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function removeBook(id) {
  const target = findBookIndex(id);

  if (target === -1) return;

  books.splice(target, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function notDoneBook(id) {
  const target = findBook(id);
  if (target == null) return;
  target.isComplete = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveBook();
}

function findBook(id) {
  for (const book of books) {
    if (book.id == id) return book;
  }
  return null;
}

function findBookIndex(id) {
  for (const index in books) {
    if (books[index].id === id) return index;
  }
  return -1;
}

function saveBook() {
  if (isStorageExist()) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
  }
}

function loadFromStorage() {
  const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageExist() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}
