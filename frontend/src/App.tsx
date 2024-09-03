import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Container, Grid, Paper, Typography, List, ListItem, ListItemText, ListItemButton, TextField, Button, IconButton } from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

const categories = [
  { id: 1, name: 'Work' },
  { id: 2, name: 'Personal' },
  { id: 3, name: 'Shopping' },
  { id: 4, name: 'Health' },
];

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const fetchedTasks = await backend.getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const addTask = async () => {
    if (newTask.trim() !== '') {
      setIsLoading(true);
      try {
        const taskId = await backend.addTask(newTask, BigInt(selectedCategory.id));
        setTasks([...tasks, { id: Number(taskId), text: newTask, category: selectedCategory.id }]);
        setNewTask('');
      } catch (error) {
        console.error('Error adding task:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const deleteTask = async (taskId) => {
    setIsLoading(true);
    try {
      await backend.deleteTask(BigInt(taskId));
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Categories</Typography>
            <List>
              {categories.map((category) => (
                <ListItemButton
                  key={category.id}
                  selected={selectedCategory.id === category.id}
                  onClick={() => setSelectedCategory(category)}
                >
                  <ListItemText primary={category.name} />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={9}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Tasks</Typography>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <TextField
                fullWidth
                variant="outlined"
                size="small"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Add a new task..."
                sx={{ mr: 1 }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={addTask}
                disabled={isLoading}
                startIcon={<AddIcon />}
              >
                Add
              </Button>
            </Box>
            <List>
              <TransitionGroup>
                {tasks
                  .filter(task => task.category === selectedCategory.id)
                  .map(task => (
                    <CSSTransition key={task.id} timeout={300} classNames="fade">
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" aria-label="delete" onClick={() => deleteTask(task.id)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={task.text} />
                      </ListItem>
                    </CSSTransition>
                  ))}
              </TransitionGroup>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}