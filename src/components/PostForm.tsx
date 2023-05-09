import { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { decode } from 'html-entities';
import {
  Container,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Card,
  CardContent,
  Divider,
  Skeleton,
  IconButton,
  CardActions
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
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

const DeleteButton = styled(IconButton)({
  marginLeft: 'auto',
});

const ToggleContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginTop: theme.spacing(2),
}));

const ToggleLabel = styled(FormControlLabel)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

const CommentCardWrapper = styled(Card)({
  marginBottom: '16px',
  position: 'relative'
});

const CommentCardContent = styled(CardContent)({
  paddingBottom: '8px',
});

const CardActionsContainer = styled(CardActions)({
  position: 'absolute',
  bottom: 0,
  right: 0,
});

import { PostType } from './AllPosts';

interface CommentType {
  _id?: string;
  email: string;
  name: string;
  comment: string;
  timestamp?: string;
  post?: string
}

const PostForm = ({ token }: { token: string | undefined }) => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [published, setPublished] = useState(false);
  const [snackBar, setSnackBar] = useState({ open: false, msg: "", error: false });
  const params = useParams();
  const navigate = useNavigate();
  const [comments, setComments] = useState<CommentType[]>(Array(3).fill(null));

  const getComments = async (postid: string | undefined) => {
    const response = await fetch(`https://blog-api-production-c132.up.railway.app/post/${postid}/comments`);
    const newComments: CommentType[] = await response.json();
    setComments(newComments);
  }

  const handleDeleteComment = async (commentid: string | undefined ) => {
    const res = await fetch(
      `https://blog-api-production-c132.up.railway.app/comment/${commentid}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      }
    );

    if (res.status == 200) {
      setSnackBar({
        open: true,
        msg: "The comment has been deleted",
        error: false
      });
      getComments(params.postid);
      return;
    }

    setSnackBar({
      open: true,
      msg: "The comment has not been deleted",
      error: true
    });
    return;
  }

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
  }

  useEffect(() => {
    if (!token) {
      navigate('/');
      return;
    }

    if (params.postid) {
      getPost(params.postid);
      getComments(params.postid);
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
      {/* Comments section */}
      { params.postid ?
      (<Container maxWidth="md" sx={{ pt: 4 }}>
        <Typography gutterBottom variant="h5" component="h2">
          Comments
        </Typography>
        <Divider sx={{ mb: 2 }} />
        {/* Map through comments and display each one */}
        {comments.map((comment: CommentType) => {
          if (comment) {
            return (
              <CommentCardWrapper key={comment._id}>
                <CommentCardContent>
                  <Typography variant="subtitle1" component="h4">
                    {decode(comment.name)}
                  </Typography>
                  <Typography variant="subtitle2" component="h5" color="textSecondary" gutterBottom>
                    {comment.email}
                  </Typography>
                  <Typography variant="body2" component="p">
                    {decode(comment.comment)}
                  </Typography>
                </CommentCardContent>
                <CardActionsContainer className="cardActions">
                  <DeleteButton
                    aria-label="delete post"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    <DeleteIcon />
                  </DeleteButton>
                </CardActionsContainer>
              </CommentCardWrapper>
            );
          }

          return (
            <CommentCardWrapper key={uuidv4()}>
              <Skeleton 
                key={uuidv4()}
                variant='rectangular'
                height={100}
              />
            </CommentCardWrapper>
          );
        })}
      </Container>) : null
    }
    </Container>
  );
};

export default PostForm;
