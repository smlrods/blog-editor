import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate, useParams } from 'react-router-dom';

const Form = styled('form')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 600,
  margin: '0 auto',
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const ToggleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const ToggleLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

import { PostType } from './AllPosts';

const PostForm = ({ token }: { token: string | undefined }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);
  const [post, setPost] = useState<PostType>();
  const [snackBar, setSnackBar] = useState({ open: false, msg: "", error: false });
  const params = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    // Add logic to submit the form data to a database or API
    // and redirect the user to the newly created blog post

    const post = {
      title: title,
      content: body,
      published: published
    }

    // Update post
    if (params.postid) {
      const res = await fetch(
        `https://blog-api-production-c132.up.railway.app/post/${params.postid}/`,
        {
          method: "PUT",
          // mode: "cors",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify(post)
        }
      );

      if (res.status == 204) {
        setSnackBar({
          open: true,
          msg: "The post has been updated",
          error: false
        });
        return;
      }

      setSnackBar({
        open: true,
        msg: "The post has not been updated",
        error: true
      });
      return;
    }

    // Create a post
    const res = await fetch(
      `https://blog-api-production-c132.up.railway.app/post/`,
      {
        method: "POST",
        // mode: "cors",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify(post)
      }
    );

    if (res.status == 201) {
      setSnackBar({
        open: true,
        msg: "The post has been created",
        error: false
      });
      setTimeout(() => {
        navigate('/posts')
      }, 1000);
      return;
    }

    setSnackBar({
      open: true,
      msg: "The post has not been created",
      error: true
    });
  }

  const getPost = async (postid: string) => {
    const res = await fetch(
      `https://blog-api-production-c132.up.railway.app/post/${postid}`
    );
    const data: PostType = await res.json();
    setTitle(data.title);
    setBody(data.content);
    setPublished(data.published);
    setPost(data);
  }

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    if (params.postid) {
      getPost(params.postid);
    }
  }, [token]);

  const handleToggleChange = () => {
    setPublished(!published);
  };

  return (
    <Container>
      <Snackbar open={snackBar.open} autoHideDuration={6000} onClose={() => setSnackBar({ ...snackBar, open: false })}>
        <Alert 
          onClose={() => setSnackBar({ ...snackBar, open: false })} 
          severity={snackBar.error ? 'error': 'success'} 
          sx={{ width: '100%'}}>
          {snackBar.msg}
        </Alert>
      </Snackbar>
      <Typography variant="h4" component="h1" align='center' gutterBottom>
        {!params.postid ? "Add New Blog Post" : "Update Blog Post"}
      </Typography>
      <Form onSubmit={handleSubmit}>
        <TextField
          label="Title"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <TextField
          label="Body"
          variant="outlined"
          margin="normal"
          required
          fullWidth
          multiline
          rows={10}
          value={body}
          onChange={(event) => setBody(event.target.value)}
        />
        <ToggleContainer>
          <ToggleLabel
            control={<Switch />}
            label={published ? 'Publish' : 'Not publish'}
            checked={published}
            onChange={handleToggleChange}
          />
        </ToggleContainer>
        <SubmitButton
          variant="contained"
          color="primary"
          type="submit"
        >
          {!params.postid ? "Create" : "Update"}
        </SubmitButton>
      </Form>
    </Container>
  );
};

export default PostForm;
