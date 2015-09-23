# frontend-scaffolding

#### How to get started

1. Start your own project folder with a git clone then git init

    ```sh
    cd ~/Code/
    hub clone jacobthemyth/frontend-scaffolding NEWPROJECT
    cd NEWPROJECT
    rm -rf .git
    git init
    git add .
    git commit -m "Initial commit"
    ```

2. Install prerequisites

    ```sh
    npm install
    bower install
    ```

3. Start watching for changes and develop it!

    ```sh
    gulp
    ```

4. Ready to push your code to GitHub Pages?

    ```sh
    # build production assets
    gulp deploy
    ```

#### Testing

- To write tests, create `.js` files in the `tests` directory. There is a sample `hello-test.js` to help you get started.
- To run tests, open http://localhost:3000/tests in your browser

#### License

MIT.
