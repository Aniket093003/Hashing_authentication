import jwt from "jsonwebtoken";
import zod from "zod";
const jwtPassword = "Aniket";
const emailSchema = zod.string().email();
const passwordSchema = zod.string().min(6);

function signJwt(username, password) {
  const resEmail = emailSchema.safeParse(username);
  const resPassword = passwordSchema.safeParse(password);
  if (!resEmail.success || !resPassword.success) {
    return null;
  }

  const signature = jwt.sign({ username }, jwtPassword);
  return signature;
}

function verifyJwt(token) {
    const verified = jwt.verify(token, jwtPassword)
    if(verified){
        return true
    }
    else{
        return false
    }
    return verifyJwt;
}

function decodeJwt(token) {
    const decoded = jwt.decode(token);
    if(decoded){
        return true;
    }
    else{
        return false;
    }
}


const ans = signJwt("aniket@gmail.com", "123123123")
console.log(ans);

const dee = decodeJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWtldEBnbWFpbC5jb20iLCJpYXQiOjE3MjY3Nzc2ODZ9.7612K0UUAzmRlHloA6ekBS07qnE1c3RQ8BIsF89iwY0")
console.log(dee);

let verified = verifyJwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFuaWtldEBnbWFpbC5jb20iLCJpYXQiOjE3MjY3Nzc2ODZ9.7612K0UUAzmRlHloA6ekBS07qnE1c3RQ8BIsF89iwY0")
console.log("verify status: ",verified)