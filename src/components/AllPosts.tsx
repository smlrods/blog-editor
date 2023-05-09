import { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Skeleton,
  Button,
  Snackbar,
  Alert,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

const PostCard = styled(Card)({
  position: 'relative',
  height: '100%',
});

const CardActionsContainer = styled(CardActions)({
  position: 'absolute',
  bottom: 0,
  right: 0,
});

const EditButton = styled(IconButton)({
  marginRight: 'auto',
});

const DeleteButton = styled(IconButton)({
  marginLeft: 'auto',
});

export interface PostType {
  title: string,
  content: string,
  timestamp: string,
  published: boolean,
  author: string,
  _id: string
}

const AllBlogPosts = ({ token }: { token: string | undefined }) => {
  const [posts, setPosts] = useState<PostType[] | null[]>(Array(6).fill(null));
  const [snackBar, setSnackBar] = useState({ open: false, msg: "", error: false });

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      getPosts(token);
    }
  }, [token, navigate]);

  const getPosts = async (token: string | undefined) => {
    const res = await fetch(
      "https://blog-api-production-c132.up.railway.app/post",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      }
    );
    const data: PostType[] = await res.json();
    setPosts(data);
  }

  const handleDeletePost = async (postId: string) => {
    const res = await fetch(
      `https://blog-api-production-c132.up.railway.app/post/${postId}/`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
      }
    );

    if (res.status == 204) {
      setSnackBar({
        open: true,
        msg: "The post has been deleted",
        error: false
      });
      getPosts(token);
      return;
    }

    setSnackBar({
      open: true,
      msg: "The post has not been deleted",
      error: true
    });
    return;
  };

  const handleEditPost = (postId: string) => {
    navigate(postId);
  };

  const handleCreatePost = () => {
    navigate('create-post');
  }

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
      <Typography variant="h4" component="h1" gutterBottom>
        All Blog Posts
      </Typography>
      {token &&
        (
          <Button 
            variant='contained'
            onClick={() => handleCreatePost()}
          >Create a Post</Button>
        )
      }
      <Box mt={2}>
        <Grid container spacing={2}>
          {posts.map((post: PostType | null) => {
            if (post) {
            return (
              <Grid item xs={12} sm={6} md={4} key={uuidv4()}>
                <Card sx={{ height: '100%' }}>
                  <PostCard>
                    <CardContent>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {post && post.title}
                      </Typography>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        {post && post.content.substring(0, 25)}...
                      </Typography>
                    </CardContent>
                    <CardActionsContainer className="cardActions">
                      <EditButton
                        aria-label="edit post"
                        onClick={() => handleEditPost(post._id)}
                      >
                        <EditIcon />
                      </EditButton>
                      <DeleteButton
                        aria-label="delete post"
                        onClick={() => handleDeletePost(post._id)}
                      >
                        <DeleteIcon />
                      </DeleteButton>
                    </CardActionsContainer>
                  </PostCard>
                </Card>
              </Grid>
              );
            }
            return (
              <Grid item xs={12} sm={6} md={4} key={uuidv4()}>
                <Skeleton variant='rectangular' height={200} />
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Container>
  );
};

export default AllBlogPosts;
