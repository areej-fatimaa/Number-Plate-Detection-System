 cd backend
    call python -m venv venv
    call venv\Scripts\activate
    echo Updaing.

    start cmd /k "pip install -r requirements.txt"

    cd ../..
    echo "installed packages"
