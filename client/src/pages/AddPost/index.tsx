import React, { useMemo, useCallback, useState, useRef } from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";
import axios from "../../axios";
import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useNavigate } from "react-router-dom";

export const AddPost = () => {
  const [isLoading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [tags, setTags] = useState("");

  const inputFileRef = useRef(null);
  const navigate = useNavigate();

  const onChange = useCallback((value) => {
    setText(value);
  }, []);

  const options = useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      // autosave: {
      //   enabled: true,
      //   delay: 1000,
      // },
    }),
    []
  );

  const handleFileChange = async (event) => {
    try {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);
      setImageUrl(data.url);
      console.log(data);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке файла");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl(null);
  };

  const onSubmit = async () => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags: tags.split(","),
        text,
      };

      const { data } = await axios.post("/posts", fields);

      const id = data._id;
      navigate(`/posts/${id}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании статьи");
    }
  };

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        hidden
        ref={inputFileRef}
        onChange={handleFileChange}
        type="file"
      />
      {imageUrl && (
        <>
          <Button
            onClick={onClickRemoveImage}
            variant="outlined"
            color="error"
            size="large"
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:5000${imageUrl}`}
            alt="uploaded"
          />
        </>
      )}
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Заголовок статьи..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        variant="standard"
        placeholder="Тэги"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          Опубликовать
        </Button>
        <Button size="large">Отмена</Button>
      </div>
    </Paper>
  );
};
