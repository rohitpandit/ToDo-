const db = require('../databases/sqlite');
const User = db.users;
const List = db.lists;


async function signup(req,res){
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        return res.send('Enter all the details');
    }else{
        try{
            const user = await User.create({
                name,
                email,
                password
            })
            if(user){
                req.session.user = user.dataValues;
                return res.redirect('/');
            }
        }
        catch{
            
            return res.send('Some error occured in signup page');
        }
    }
}

async function signin(req, res){
    const {email, password} = req.body;
    if(!email || !password){
        return res.send('Enter all the details');
    }else{
        try{
            const user = await User.findOne({
                where: {email:email}
            })
            if(user){
                console.log(user);
                req.session.user = user.dataValues;
                res.redirect('/');
            }
        }catch{
            res.send('some error in getting the user data')

        }
        
    }
}

function signout(req, res){
    req.session.destroy(err =>{
        if(err){
            console.log('error');
            return res.redirect('/');
        }
    })

    return res.redirect('signin')
}

function addList(req,res){
    const text = req.body.newTodo;
    if(!text){
        console.log('Enter The text first')
        return res.redirect('/');
    }else{
        List.create({
            item: text,
            edit: 'false',
            done: 'false',
            user_id: req.session.user.id
        })
        .then(list =>{
            if(list){
                console.log(list.toJSON());
                
            }
        })
        .catch(err =>{
            console.log(err)
        })
        return res.redirect('/');
    }
}

function deleteOne(req, res){
    const listId = req.body.id;
    List.destroy({
        where:{
            id : listId
        }
    })
    .then(() =>{
        console.log("entry deleted successfully")
    })
    .catch((err)=>{
        console.log(err)
    })
    return res.redirect('/')

}

function doneOne(req,res){
    const listId = req.body.id;
    List.findOne({
        where:{
            id: listId
        }
    })
    .then(row =>{
        row.done = 'done';
        row.save();
        return res.redirect('/');
    })
    .catch(err =>{
        console.log(err)
    })
}

function edit(req,res){
    var listId = req.body.id;
    var newText= req.body.newText;
    List.findOne({
        where:{
            id: listId
        }
    })
    .then(row =>{
        row.item= newText;
        row.save();
        return res.redirect('/');
    })
    .catch(err =>{
        console.log(err);
    })
}




module.exports = {
    signup: signup,
    signin: signin,
    signout: signout,
    addList: addList,
    deleteOne: deleteOne,
    doneOne: doneOne,
    edit: edit
}