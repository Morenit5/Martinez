
//this key must be protected and having it here in the code is a bad idea 
//ideally we must have it outside the code 
//you must protect this key using appropriate measures such as a secrets vault, environment variable, or configuration service. 
export const jwtConstants = {
  secret: 'DO NOT USE THIS VALUE. INSTEAD, CREATE A COMPLEX SECRET AND KEEP IT SAFE OUTSIDE OF THE SOURCE CODE.',
};
