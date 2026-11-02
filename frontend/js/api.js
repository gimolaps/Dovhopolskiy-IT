// One shared data interface. Replace these functions with fetch() calls
// once the Spring Boot API endpoints and JSON payloads are agreed on.
import {initMock,currentUser,demoSignIn,demoRegister,demoSignOut,demoUsers,demoRequests,demoCreateRequest,demoUpdateRequest} from './mockData.js';

export const USE_MOCK = true;

function requireApiAgreement(){throw new Error('Backend integration is not configured yet. Agree on endpoint URLs, authentication and response schemas with your backend team.');}
async function mockOrBackend(fn){if(!USE_MOCK)return requireApiAgreement();initMock();return fn();}

export const api = {
  getCurrentUser:()=>mockOrBackend(currentUser),
  signIn:(email,password)=>mockOrBackend(()=>demoSignIn(email,password)),
  register:(payload)=>mockOrBackend(()=>demoRegister(payload)),
  signOut:()=>mockOrBackend(demoSignOut),
  getUsers:()=>mockOrBackend(demoUsers),
  getRequests:()=>mockOrBackend(demoRequests),
  createRequest:(user,device,description)=>mockOrBackend(()=>demoCreateRequest(user,device,description)),
  updateRequest:(id,status)=>mockOrBackend(()=>demoUpdateRequest(id,status))
};
