# project setup ( part 1 )

1. npm create vite@latest name-of-your-project -- --template react

   npm install react-router-dom localforage match-sorter sort-by

2. npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p

3. tailwind.config.js
   content: [
   "./index.html",
   "./src/**/*.{js,ts,jsx,tsx}",
   ],
4. src (index.css)
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
5. npm i -D daisyui@latest
6. tailwind.config.js
   plugins: [require("daisyui")],
7. eslintrc.cjs
   env: {... node:true}

# project setup ( part 2 )

1. routes setup
2. npm i react-responsive-carousel
3. npm i react-hook-form
4. npm install firebase
5. npm install sweetalert2
6. npm install animate.css --save
7. install plotlyjs
8. npm install papaparse
9. npm install react-spring

