const { createClient } = require('@supabase/supabase-js');
const { spawn } = require('child_process');
const path = require('path');

const SUPABASE_URL = "https://thfphwduxzyojnnbuwey.supabase.co";
const SUPABASE_KEY = "sb_publishable_UtG5RfQWaq_3TSU8nFYe5g_ppp-LLUz";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Function to call the Python model and return a promise
function getRatings(comments) {
    return new Promise((resolve) => {
        const pythonProcess = spawn('python3', [path.join(__dirname, 'classify.py')]);
        let output = '';
        pythonProcess.stdin.write(comments.join('\n'));
        pythonProcess.stdin.end();
        pythonProcess.stdout.on('data', (data) => output += data.toString());
        pythonProcess.on('close', () => resolve(output.trim().split('\n').map(Number)));
    });
}

// Main
(async () => {
    // 1. Fetch all data from Supabase
    const { data: rows, error } = await supabase
        .from('comments')
        .select('driver_name, comment');

    if (error) throw new Error(`Database error: ${error.message}`);

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
})();
