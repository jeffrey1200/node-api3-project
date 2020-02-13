const express = require("express");

const router = express.Router();

const users = require("./userDb");

const posts = require("../posts/postDb");
router.use(express.json());

router.post("/", validateUser, (req, res) => {
  users
    .insert(req.body)
    .then(newUser => {
      res.status(200).json(newUser);
    })
    .catch(err => res.status(500).json({ error: "oops something went wrong" }));
  // do your magic!
});

router.post("/:id/posts", validatePost, (req, res) => {
  const info = req.body;
  const user_id = req.params.id;
  const newPost = { text: info.text, user_id };
  posts
    .insert(newPost)
    .then(post => {
      res.status(201).json(post);
    })
    .catch(err => res.status(500).json({ error: "oops,something went wrong" }));
  // do your magic!
});

router.get("/", (req, res) => {
  users
    .get()
    .then(userList => {
      res.status(200).json(userList);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "ooops, something went wrong with the server" })
    );
});

router.get("/:id", validateUserId, (req, res) => {
  const { id } = req.params;

  users
    .getById(id)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "ooops, something went wrong with the server" })
    );
  // do your magic!
});

router.get("/:id/posts", (req, res) => {
  const info = { ...req.body, user_id: req.params.id };

  users
    .getUserPosts(info.user_id)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "ooops, something went wrong with the server" })
    );
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  users
    .remove(id)
    .then(removed => {
      res.status(201).json(removed);
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "ooops, something went wrong with the server" })
    );
  // do your magic!
});

router.put("/:id", (req, res) => {
  const { id } = req.params;
  users
    .update(id, req.body)
    .then(updated => {
      if (updated) {
        res.status(200).json(updated);
      } else {
        res.status(404).json({ message: "The hub could not be found" });
      }
    })
    .catch(err =>
      res
        .status(500)
        .json({ error: "ooops, something went wrong with the server" })
    );
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  console.log(id);
  users
    .getById(id)
    .then(user => {
      if (!user) {
        res.status(404).json({ error: "the id doesn't exist" });
      } else {
        req.user = user;
      }
    })
    .catch(err => {
      res.status(500).json({ error: "ooops,something went wrong" });
    });

  next();
}

function validateUser(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing user data"
    });
  } else if (!req.body.name) {
    res.status(400).json({
      message: "missing required name field"
    });
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body) {
    res.status(400).json({
      message: "missing post data"
    });
  } else if (!req.body.text) {
    res.status(400).json({
      message: "missing required text field"
    });
  } else {
    next();
  }
  // do your magic!
}

module.exports = router;
