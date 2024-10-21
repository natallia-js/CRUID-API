describe("scenario 2", () => {
  const baseURL = `http://localhost:${process.env.PORT}/api/users/`;

  test("scenario 2", async () => {
    // 0) delete all users
    await fetch(baseURL, { method: "DELETE" });

    // 1)
    let response = await fetch(baseURL, { method: "GET" });
    expect(response.status).toBe(200);
    const users = await response.json();
    expect(users).toEqual([]);

    // 2)
    const newUser = {
      username: "John",
      age: 10,
      hobbies: ["hobby1", "hobby2"],
    };
    let request = new Request(baseURL, {
      method: "POST",
      body: JSON.stringify(newUser),
      credentials: "omit",
    });
    response = await fetch(request);
    expect(response.status).toBe(201);
    const createdUser: any = await response.json();
    expect(createdUser.username).toEqual(newUser.username);
    expect(createdUser.age).toEqual(newUser.age);
    expect(createdUser.hobbies).toEqual(newUser.hobbies);

    // 3)
    const modUserData = {
      age: 12,
    };
    request = new Request(baseURL + createdUser.id, {
      method: "PUT",
      body: JSON.stringify(modUserData),
      credentials: "omit",
    });
    response = await fetch(request);
    expect(response.status).toBe(200);
    const modUser: any = await response.json();
    expect(modUser).toEqual({ ...createdUser, ...modUserData });
  });
});
