describe("scenario 3", () => {
  const baseURL = `http://localhost:${process.env.PORT}/api/users/`;

  test("scenario 3", async () => {
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
    request = new Request(baseURL + createdUser.id, {
      method: "DELETE",
      body: null,
      credentials: "omit",
    });
    response = await fetch(request);
    expect(response.status).toBe(204);

    // 4)
    response = await fetch(baseURL + createdUser.id, { method: "GET" });
    expect(response.status).toBe(404);
  });
});
