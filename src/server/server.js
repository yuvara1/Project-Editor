const mysql = require('mysql2/promise');
const express = require('express');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
     host: 'localhost',
     user: 'root',
     password: 'Yuvaraj@1',
     database: 'editor'
});

app.get('/users', async (req, res) => {
     try {
          const name = req.query.name;
          const [rows] = await db.query(`SELECT * FROM editor.userinfo WHERE Name = "${name}" OR Email="${name}"`); // Await the query
          res.json(rows);
          console.log('Data fetched successfully');
     } catch (error) {
          console.error('Error fetching users:', error);
          res.status(500).send('Error fetching users');
     }
});

app.post('/insertUser', async (req, res) => {
     try {
          db.query(`INSERT INTO userinfo (Name, Password,Email) VALUES ('${req.body.name}', '${req.body.password}', '${req.body.email}')`);
          console.log('Data inserted successfully');
     }
     catch (err) {

     }
})

app.get('/files', async (req, res) => {
     try {
          const [rows] = await db.query('SELECT filename FROM editor.fileinfo');
          res.json(rows);
          console.log('Data fetched successfully');
          console.log(rows)
     } catch (error) {
          console.error('Error fetching files:', error);
          res.status(500).send('Error fetching files');
     }
});

app.get('/read', async (req, res) => {
     try {
          const filename = req.query.fileName;
          db.query(`SELECT content FROM editor.fileinfo WHERE FileName = "${filename}"`)
               .then(([rows]) => {
                    res.json(rows);
                    console.log('Data fetched successfully');
               })
               .catch((error) => {
                    console.error('Error fetching data:', error);
                    res.status(500).send('Error fetching data');
               });
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Error fetching data');
     }
});

app.post('/updateFile', async (req, res) => {
     try {
          const dataToAppend = req.body.content;
          const filePath = req.body.fileName;
          db.query(`UPDATE fileinfo SET Content = '${dataToAppend}' WHERE filename = '${filePath}'`);
          console.log('Data updated successfully');
          res.status(200).send('File updated successfully');
     } catch (error) {
          console.error('Error updating data:', error);
          res.status(500).send('Error updating data');
     }
});

app.post('/deletefile', async (req, res) => {
     console.log(req.body)
     try {
          const filePath = req.body.fileName;
          console.log('Deleting file:', filePath); 
          await db.query(`DELETE FROM fileinfo WHERE filename = '${filePath}'`);
          console.log('Data deleted successfully');
          res.status(200).send('File deleted successfully');
     } catch (error) {
          console.error('Error deleting data:', error);
          res.status(500).send('Error deleting data');
     }
})

app.post('/createnew', async (req, res) => {
     try {
          const dataToAppend = req.body.content;
          const filePath = req.body.fileName;
          db.query(`INSERT INTO fileinfo (filename, content) VALUES ('${filePath}', '${dataToAppend}')`);
          console.log('File created:', filePath);
          res.status(200).send('File created successfully');
     } catch (error) {
          console.error('Error creating file:', error);
          res.status(500).send('Error creating file');
     }
});

app.get('/access', async (req, res) => {
     try {
          const [rows] = await db.query('SELECT Name,access FROM editor.userinfo');
          res.json(rows);
          console.log('Data');
          console.log('Data fetched successfully');
     } catch (error) {
          console.error('Error fetching data:', error);
          res.status(500).send('Error fetching data');
     }
})

app.post('/updateaccess', async (req, res) => {
     try {
          console.log(req.body)
          await db.query(`UPDATE editor.userinfo SET access = ${req.body.access} WHERE Name = '${req.body.name}'`);
          console.log('Data updated successfully');
          res.status(200).send('Access updated successfully');
     } catch (error) {
          console.error('Error updating data:', error);
          res.status(500).send('Error updating data');
     }
})



app.listen(port, () => {
     console.log(`Server listening on port ${port}`);
});