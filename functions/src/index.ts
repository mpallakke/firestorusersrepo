import * as express from 'express';
import * as bodyParser from "body-parser";
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());

export const webApi = functions.https.onRequest(main);

app.get('/', (request, response) => {

    response.send('Welcome to VSNA.');

});

app.post('/users', async (request, response) => {
  try {
    const {
      2018registered,
      2019registered,
      Date registered,
      Email address,
      Husband,
      Last Name,
      Phone number,
      Remarks,
      Wife,
      id
    } = request.body;

    const data = {

      2018registered,
      2019registered,
      Date registered,
      Email address,
      Husband,
      Last Name,
      Phone number,
      Remarks,
      Wife,
      id
    } 
    const userRef = await db.collection('users').add(data);
    const user = await userRef.get();

    response.json({
      id: userRef.id,
      data: user.data()
    });

  } catch(error){

    response.status(500).send(error);  // Return error

  }
});

app.get('/users/:id', async (request, response) => {
  try {
    const userId = request.params.id;

    if (!userId) throw new Error('Fight ID is required');

    const user = await db.collection('users').doc(userId).get();

    if (!user.exists){
        throw new Error('Fight doesnt exist.')
    }

    response.json({
      id: user.id,
      data: user.data()
    });

  } catch(error){

    response.status(500).send(error);  // Return 500 error

  }
});

app.get('/users', async (request, response) => {
  try {

    const userQuerySnapshot = await db.collection('users').get();
    const users:any = [];  // TBD any!!!
    userQuerySnapshot.forEach(
        (doc) => {
            users.push({
                id: doc.id,
                data: doc.data()
            });
        }
    );

    response.json(users);

  } catch(error){

    response.status(500).send(error);  // Return 500 Error

  }

});

/****
app.put('/users/:id', async (request, response) => {
  try {

    const userId = request.params.id;
    const firstname = request.body.firstname;

    if (!userId) throw new Error('id is blank');

    if (!firstname) throw new Error('Title is required');

    const data = { 
        firstname
    };

    const userRef: any = await db.collection('users')
        .doc(userId)
        .set(data, { merge: true });

    response.json({
        id: userId,
        data
    })


  } catch(error){

    response.status(500).send(error);   // Return 500 Error

  }

});

****/

app.delete('/users/:id', async (request, response) => {
  try {

    const userId = request.params.id;

    if (!userId) throw new Error('id is blank');

    await db.collection('users')
        .doc(userId)
        .delete();

    response.json({
        id: userId,
    })


  } catch(error){

    response.status(500).send(error);   //Return 500 error

  }

});
