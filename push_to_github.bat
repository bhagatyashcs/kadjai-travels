@echo off
cd /d "C:\Users\Trupti\Downloads\Kadjai Travel"
echo ==============================================================
echo Pushing Kadjai Travels to https://github.com/bhagatyashcs/kadjai-travels
echo ==============================================================
git push -u origin main
echo.
echo ==============================================================
echo Push Complete! Now connect to Render:
echo 1. Go to https://dashboard.render.com
echo 2. Click New + -^> Web Service
echo 3. Connect: https://github.com/bhagatyashcs/kadjai-travels
echo ==============================================================
pause
