const sqlite3 = require('sqlite3').verbose();
const { spawn } = require('child_process');

const db = new sqlite3.Database('./database.db');

// Function to call the Python model and return a promise
function getRatings(comments) {
    return new Promise((resolve) => {
        const pythonProcess = spawn('python', ['classify.py']);
        let output = '';
        pythonProcess.stdin.write(comments.join('\n'));
        pythonProcess.stdin.end();
        pythonProcess.stdout.on('data', (data) => output += data.toString());
        pythonProcess.on('close', () => resolve(output.trim().split('\n').map(Number)));
    });
}

// 1. Fetch all data
db.all("SELECT driver_name, comment FROM comments", [], async (err, rows) => {
    if (err) throw err;

    // 2. Group comments by driver name
    const grouped = rows.reduce((acc, row) => {
        if (!acc[row.driver_name]) acc[row.driver_name] = [];
        acc[row.driver_name].push(row.comment);
        return acc;
    }, {});

    console.log("Bus Driver Rating Predictor");
    console.log("----------------------------");

    // 3. Process each driver separately
    for (const driver in grouped) {
        const comments = grouped[driver];
        const ratings = await getRatings(comments);
        
        console.log(`\nResults for: ${driver}`);
        console.log("Comment Scores:");
        
        comments.forEach((c, i) => {
            console.log(`  [ ${ratings[i].toFixed(1)} ]  ${c}`);
        });

        const overall = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        console.log(`Overall Rating for ${driver}: ${overall} / 10`);
        console.log("----------------------------");
    }
});