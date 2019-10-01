// book class: represent a book
class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
  }
}

/**
 *
 *UI class: handle ui task
 *
 */
class UI {
  // we dont want to instanceciate ui class so we going to make all mrethod static
  static displayBooks() {
    // const storedBooks = [
    //   {
    //     title: "ABC",
    //     author: "monga",
    //     isbn: "6jsdvsd3e"
    //   },
    //   {
    //     title: "XYZ",
    //     author: "Punga",
    //     isbn: "sds7783"
    //   }
    // ];
    // const books = storedBooks;
    const books = Store.getBooks();

    books.forEach(book => {
      UI.addBookToList(book);
    });
  }

  static addBookToList(book) {
    const list = document.querySelector("#book-list");
    const row = document.createElement("tr");
    row.innerHTML = `
		<td>${book.title}</td>
		<td>${book.author}</td>
		<td>${book.isbn}</td>
		<td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
		`;
    list.appendChild(row);
  }

  static deleteBook(el) {
    if (el.classList.contains("delete")) {
      // remove from ui
      el.parentElement.parentElement.remove();
    }
  }

  static showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert alert-${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector(".container");
    const form = document.querySelector("#book-form");
    container.insertBefore(div, form); //insert the "div" before "form" of the parent "container"
    setTimeout(() => {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  static clearFields() {
    document.querySelector("#title").value = "";
    document.querySelector("#author").value = "";
    document.querySelector("#isbn").value = "";
  }
}

/**
 *
 // Store class
 *
 */
class Store {
  static getBooks() {
    //   you cant store object in localstorage it has to be string
    let books;
    if (localStorage.getItem("books") === null) {
      books = [];
    } else {
      books = JSON.parse(localStorage.getItem("books"));
    }
    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem("books", JSON.stringify(books));
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn) {
        books.splice(index, 1);
      }
    });
    localStorage.setItem("books", JSON.stringify(books));
  }
}
// Event : display

document.addEventListener("DOMContentLoaded", UI.displayBooks());

/**
 *
 *
 *
 */
// Event : add
document.querySelector("#book-form").addEventListener("submit", e => {
  e.preventDefault();
  let title = document.querySelector("#title").value;
  let author = document.querySelector("#author").value;
  let isbn = document.querySelector("#isbn").value;

  if (title === "" || author === "" || isbn === "") {
    UI.showAlert("Please fill all the fields", "danger");
    return;
  }
  const book = new Book(title, author, isbn);
  console.log(`book ${JSON.stringify(book)}`);
  //   Add book to UI
  UI.addBookToList(book);

  //   add book to store
  Store.addBook(book);
  UI.showAlert("Book Added", "success");
  //   clear fields
  UI.clearFields();
});

/**
 *
 *
 *
 */
// Event : remove
document.querySelector("#book-list").addEventListener("click", e => {
  console.log(e.target);
  UI.deleteBook(e.target);
  // remove from localstorge
  console.log(e.target.parentElement.previousElementSibling.textContent);
  Store.removeBook(e.target.parentElement.previousElementSibling.textContent);
});
