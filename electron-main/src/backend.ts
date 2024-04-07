// Using ES6 import syntax to import external resources
import { SERVER_PORT } from "./constants";
import * as path from 'path';
import * as os from 'os';
import { exec } from 'child_process';
import { app } from 'electron';
import cors from 'cors';
import express, { Request, Response } from 'express';



const backendApp = express();
backendApp.use(cors());
backendApp.use(express.json());

//==== absolute path for different electronJS environments ==== :
let exeFilePath: string;


// ==== For checking the version of the Python-executable (exe) file,
    // depending on the core processor architecture, such as M1 or Intel Core i5.
const arch = os.arch();
let exeArchType= '';
if (arch == 'x64'){
    exeArchType = 'main_x86_64';
}
else{
    exeArchType = 'main';
}
// 


// ==== path

if (app.isPackaged) {
    // for production environment
    const asarPath = app.getAppPath();
    exeFilePath = path.join(asarPath,'..','python', exeArchType);
} else {
    // for development environment
    exeFilePath = path.join(path.dirname(__dirname), '..','src','python',exeArchType);
}

// 


//==== define GET server endpoint ====
    backendApp.get('/', (req: Request, res: Response) =>{
        console.log('GET request received', req.query);
        const functionName: string = typeof req.query.functionName === 'string' ? req.query.functionName : '';
        const Arguments   : string = typeof req.query.Arguments    === 'string' ? req.query.Arguments    : '';
        if (!functionName || !Arguments) {
        //pattern1(PASS)
        // curl -X GET 'http://localhost:8080?functionName=square&Arguments=4' -H 'Content-Type: application/json'
        // => ["req.query.functionName","square"]   
        //pattern2(PASS)
        // curl -X GET 'http://localhost:8080?functionName=square' -H 'Content-Type: application/json'
        // => {"error":"Invalid or miss request parameters"} 
        
        res.status(400).json({ error: 'Invalid or miss request parameters' });
            return;
        }
    
        exec(`${exeFilePath} ${functionName} ${Arguments}`, (error : Error| null , stdout, stderr) => {
            if (error) {//if can't find the exeFilePath, or PC's processor is not match with it.
                console.error(`Error executing main.exe: ${error.message}`);
                res.status(500).json({ 
                    error: 'error500 #1',
                    errorMsg: error.message,
                });
                return;
            }
            if (stderr) {
                console.error(`main stderr: ${stderr}`);
                res.status(500).json({ 
                    error: 'error500 #2',
                    errorMeg: stderr 
                });
                return;
            }
            console.log(`main stdout: ${stdout}`);
            res.json([stdout, "test worked"]);
            //pattern3 (PASS)
            // curl -X GET 'http://localhost:8080?functionName=square&Arguments=4' -H 'Content-Type: application/json'
            // => ["16\n","test worked"]

        });

});





//==== backend server.listen on SERVER_PORT====

// ==== backend firstly test by curl ==== : 
// curl -X GET 'http://localhost:8080?functionName=square&Arguments=4' -H 'Content-Type: application/json'
// server response ok.



const server = backendApp.listen(SERVER_PORT, () => {
    console.log(`Server running on port ${SERVER_PORT}`);
});

// Handle server startup errors
server.on('error', (error:  Error) => {
    console.error('Server startup error:', error);
});
