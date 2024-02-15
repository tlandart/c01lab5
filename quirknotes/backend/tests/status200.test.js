test("1+2=3, empty array is empty", () => {
    expect(1 + 2).toBe(3);
    expect([].length).toBe(0);
});

const SERVER_URL = "http://localhost:4000";

test("/postNote - Post a note", async () => {
  const title = "NoteTitleTest";
  const content = "NoteTitleContent";

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
    }),
  });

  const postNoteBody = await postNoteRes.json();

  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");
});

test("/getAllNotes - Return list of zero notes for getAllNotes", async () => {
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  expect(deleteAllNotesRes.status).toBe(200);
  
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getAllNotesRes.json();

  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(0);
});

test("/getAllNotes - Return list of two notes for getAllNotes", async () => {
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  expect(deleteAllNotesRes.status).toBe(200);

  const postNote1Res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note 1 Title",
      content: "Note 1 Content",
    }),
  });

  const postNote1Body = await postNote1Res.json();
  expect(postNote1Res.status).toBe(200);
  expect(postNote1Body.response).toBe("Note added succesfully.");

  const postNote2Res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note 2 Title",
      content: "Note 2 Content",
    }),
  });

  const postNote2Body = await postNote2Res.json();
  expect(postNote2Res.status).toBe(200);
  expect(postNote2Body.response).toBe("Note added succesfully.");
  
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);
  expect(getAllNotesBody.response.length).toBe(2);
});

test("/deleteNote - Delete a note", async () => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note Title",
      content: "Note Content",
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  
  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteBody.insertedId}`, {
    method: "DELETE",
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} deleted.`);
});

test("/patchNote - Patch with content and title", async () => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Old Title",
      content: "Old Content",
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postNoteBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "New Title",
      content: "New Content",
    }),
  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);

  // get the note corresponding to that id and check if it actually changed
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);

  const i = getAllNotesBody.response.findIndex(note => {return note._id === postNoteBody.insertedId});
  expect(getAllNotesBody.response[i].title).toBe("New Title");
  expect(getAllNotesBody.response[i].content).toBe("New Content");

  expect(patchNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} patched.`);
  
  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteBody.insertedId}`, {
    method: "DELETE",
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} deleted.`);
});

test("/patchNote - Patch with just title", async () => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Old Title",
      content: "Old Content",
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postNoteBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "New Title",
    }),
  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);

  // get the note corresponding to that id and check if it actually changed
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);

  const i = getAllNotesBody.response.findIndex(note => {return note._id === postNoteBody.insertedId});
  expect(getAllNotesBody.response[i].title).toBe("New Title");
  expect(getAllNotesBody.response[i].content).toBe("Old Content");

  expect(patchNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} patched.`);
  
  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteBody.insertedId}`, {
    method: "DELETE",
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} deleted.`);
});

test("/patchNote - Patch with just content", async () => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Old Title",
      content: "Old Content",
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  const patchNoteRes = await fetch(`${SERVER_URL}/patchNote/${postNoteBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      content: "New Content",
    }),
  });

  const patchNoteBody = await patchNoteRes.json();
  expect(patchNoteRes.status).toBe(200);
  expect(patchNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} patched.`);

  // get the note corresponding to that id and check if it actually changed
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);

  const i = getAllNotesBody.response.findIndex(note => {return note._id === postNoteBody.insertedId});
  expect(getAllNotesBody.response[i].title).toBe("Old Title");
  expect(getAllNotesBody.response[i].content).toBe("New Content");
  
  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteBody.insertedId}`, {
    method: "DELETE",
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} deleted.`);
});

test("/deleteAllNotes - Delete one note", async () => {
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  expect(deleteAllNotesRes.status).toBe(200);

  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note 1 Title",
      content: "Note 1 Content",
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  const deleteAllNotes2Res = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  
  const deleteAllNotes2Body = await deleteAllNotes2Res.json();
  expect(deleteAllNotes2Res.status).toBe(200);
  expect(deleteAllNotes2Body.response).toBe("1 note(s) deleted.");
});

test("/deleteAllNotes - Delete three notes", async () => {
  const deleteAllNotesRes = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  expect(deleteAllNotesRes.status).toBe(200);

  const postNote1Res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note 1 Title",
      content: "Note 1 Content",
    }),
  });

  const postNote1Body = await postNote1Res.json();
  expect(postNote1Res.status).toBe(200);
  expect(postNote1Body.response).toBe("Note added succesfully.");

  const postNote2Res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note 2 Title",
      content: "Note 2 Content",
    }),
  });

  const postNote2Body = await postNote2Res.json();
  expect(postNote2Res.status).toBe(200);
  expect(postNote2Body.response).toBe("Note added succesfully.");

  const postNote3Res = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note 3 Title",
      content: "Note 3 Content",
    }),
  });

  const postNote3Body = await postNote3Res.json();
  expect(postNote3Res.status).toBe(200);
  expect(postNote3Body.response).toBe("Note added succesfully.");

  const deleteAllNotes2Res = await fetch(`${SERVER_URL}/deleteAllNotes`, {
    method: "DELETE",
  });
  
  const deleteAllNotes2Body = await deleteAllNotes2Res.json();
  expect(deleteAllNotes2Res.status).toBe(200);
  expect(deleteAllNotes2Body.response).toBe("3 note(s) deleted.");
});

test("/updateNoteColor - Update color of a note to red (#FF0000)", async () => {
  const postNoteRes = await fetch(`${SERVER_URL}/postNote`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: "Note Title",
      content: "Note Content",
    }),
  });

  const postNoteBody = await postNoteRes.json();
  expect(postNoteRes.status).toBe(200);
  expect(postNoteBody.response).toBe("Note added succesfully.");

  const updateNoteColorRes = await fetch(`${SERVER_URL}/updateNoteColor/${postNoteBody.insertedId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      color: "#FF0000",
    }),
  });

  const updateNoteColorBody = await updateNoteColorRes.json();
  expect(updateNoteColorRes.status).toBe(200);
  expect(updateNoteColorBody.message).toBe("Note color updated successfully.");

  // get the note corresponding to that id and check if it actually changed
  const getAllNotesRes = await fetch(`${SERVER_URL}/getAllNotes`, {
    method: "GET",
  });

  const getAllNotesBody = await getAllNotesRes.json();
  expect(getAllNotesRes.status).toBe(200);

  const i = getAllNotesBody.response.findIndex(note => {return note._id === postNoteBody.insertedId});
  expect(getAllNotesBody.response[i].color).toBe("#FF0000");
  
  const deleteNoteRes = await fetch(`${SERVER_URL}/deleteNote/${postNoteBody.insertedId}`, {
    method: "DELETE",
  });

  const deleteNoteBody = await deleteNoteRes.json();
  expect(deleteNoteRes.status).toBe(200);
  expect(deleteNoteBody.response).toBe(`Document with ID ${postNoteBody.insertedId} deleted.`);
});