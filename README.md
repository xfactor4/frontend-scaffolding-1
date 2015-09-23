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
You will need to install the `testem` command line program:

```sh
npm install -g testem
```

Then in this project directory, you can run the tests:

```sh
testem # Runs the watcher that constantly reloads the tests
testem ci # Runs the tests once
```

#### License

MIT.
