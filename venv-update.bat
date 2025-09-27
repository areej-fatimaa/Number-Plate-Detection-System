 cd backend
    call venv\Scripts\activate
    echo Updaing.

    start cmd /k "pip install -r requirements.txt"

    cd ../..
    echo "installed packages"
