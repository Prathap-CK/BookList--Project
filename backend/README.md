📚 BookList Manager

A full-stack Node.js + Express + PostgreSQL project for adding, storing, editing & deleting books with OpenLibrary API integration.

🚀 Features

✔ Add books with title, author, rating, review
✔ Fetch book covers from OpenLibrary API
✔ PostgreSQL database persistence
✔ CRUD — Create, Read, Update, Delete
✔ Sorting: newest, oldest, highest rated, lowest
✔ Modern UI with Bootstrap
✔ Dark mode toggle
✔ Smooth animations & book cards
✔ MVC architecture
✔ Completely responsive

🛠 Tech Stack

Frontend:

EJS

Bootstrap 5

Custom CSS

Animations

Backend:

Node.js

Express.js

PostgreSQL

Axios (for API calls)

dotenv

🗄 Database Schema
CREATE TABLE books (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    isbn VARCHAR(50),
    openlibrary_id VARCHAR(50),
    cover_url TEXT,
    rating INTEGER DEFAULT 0,
    review TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

🧩 Installation & Usage
1️⃣ Clone the repo
git clone https://github.com/YOUR_USERNAME/booklist.git
cd booklist

2️⃣ Install dependencies
npm install

3️⃣ Create .env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/booklist
PORT=3000

4️⃣ Start the server
npm run dev


💬 API Used

🔗 OpenLibrary API
https://openlibrary.org/dev/docs/api/covers

👤 Author

Prathap
Feel free to connect on LinkedIn!