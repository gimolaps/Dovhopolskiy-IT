import {
  initMock,
  currentUser,
  demoSignIn,
  demoRegister,
  demoSignOut,
  demoUsers,
  demoRequests,
  demoCreateRequest,
  demoUpdateRequest,
  demoUpdateUserRole,
  demoSetUserActive,
  demoDeleteUser,
  demoCreateStaff
} from './mockData.js';


export const USE_MOCK = true;
export const API_BASE_URL = "http://localhost:8080";

async function request(method, endpoint, data) {
  const url = API_BASE_URL + endpoint;
  const options = {
    method: method,
    headers: {
      "Accept": "application/json"
    },
    credentials: "include"
  };
  if (data !== undefined) {
    options.headers["Content-Type"] = "application/json";
    options.body = JSON.stringify(data);
  }
  let response;
  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error("Cannot connect to Backend");
  }
  const contentType = response.headers.get("content-type") || "";
  const result = contentType.includes("application/json")
    ? await response.json()
    : null;
  if (!response.ok) {
    const messages = {
      400: "Please check the entered information.",
      401: "Invalid credentials or expired session.",
      403: "You do not have permission to perform this action.",
      404: "Requested resource was not found.",
      409: "This information conflicts with an existing record."
    };
    let message;
    if (response.status >= 500) {
      message = "Server error. Please try again later.";
    } else if (response.status === 400 || response.status === 409) {
      message = result?.message || messages[response.status];
    } else {
      message = messages[response.status]
        || result?.message
        || `Request failed (${response.status}).`;
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }
  return result;
}
function requireApiAgreement() {
  throw new Error('Backend integration is not configured yet. Agree on endpoint URLs, authentication and response schemas with your backend team.');
}
async function mockOrBackend(fn) { if (!USE_MOCK) return requireApiAgreement(); initMock(); return fn(); }

export const api = {
  getCurrentUser: async () => {
    if (USE_MOCK) {
      return mockOrBackend(currentUser);
    }
    try {
      return await request("GET", "/api/auth/me");
    } catch (error) {
      if (error.status === 401) {
        return null;
      }
      throw error;
    }
  },
  signIn: (email, password) => {
    if (USE_MOCK) {
      return mockOrBackend(() => demoSignIn(email, password));
    }
    return request("POST", "/api/auth/login", {
      email: email,
      password: password
    });
  },
  register: (payload) => {
    if (USE_MOCK) {
      return mockOrBackend(() => demoRegister(payload));
    }
    return request("POST", "/api/auth/register", payload);
  },
  signOut: async () => {
    if (USE_MOCK) {
      return mockOrBackend(demoSignOut);
    }
    return await request("POST", "/api/auth/logout");
  },
  getUsers: async () => {
    if (USE_MOCK) {
      return mockOrBackend(() =>
        demoUsers().filter(user => user.deleted !== true)
      );
    }
    return await request("GET", "/api/users");
  },
  updateUserRole: async (userId, newRole) => {
    if (USE_MOCK) {
      return mockOrBackend(() =>
        demoUpdateUserRole(userId, newRole)
      );
    }
    return await request(
      "PATCH",
      `/api/users/${encodeURIComponent(userId)}/role`,
      {
        role: newRole
      }
    );
  },
  setUserActive: async (userId, active) => {
    if (USE_MOCK) {
      return mockOrBackend(() =>
        demoSetUserActive(userId, active)
      );
    }
    return await request(
      "PATCH",
      `/api/users/${encodeURIComponent(userId)}/status`,
      {
        active: active
      }
    );
  },
  deleteUser: async (userId) => {
    if (USE_MOCK) {
      return mockOrBackend(() =>
        demoDeleteUser(userId)
      );
    }
    return await request(
      "DELETE",
      `/api/users/${encodeURIComponent(userId)}`
    );
  },
  createStaff: async (payload) => {
    if (USE_MOCK) {
      return mockOrBackend(() =>
        demoCreateStaff(payload)
      );
    }
    return await request(
      "POST",
      "/api/admin/staff",
      payload
    );
  },
  getRequests: async () => {
    if (USE_MOCK) {
      return mockOrBackend(demoRequests);
    }
    return await request("GET", "/api/requests");
  },
  createRequest: async (user, device, description, phone) => {
    if (USE_MOCK) {
      return mockOrBackend(() =>
        demoCreateRequest(user, device, description, phone)
      );
    }
    return await request("POST", "/api/requests", {
      device: device,
      description: description,
      phone: phone
    });
  },
  updateRequest: async (id, status) => {
    if (USE_MOCK) {
      return mockOrBackend(() => demoUpdateRequest(id, status));
    }
    return await request(
      "PATCH",
      `/api/requests/${encodeURIComponent(id)}/status`,
      {
        status: status
      }
    );
  }
};
