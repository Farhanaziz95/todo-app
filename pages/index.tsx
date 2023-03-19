/* eslint-disable react/no-children-prop */
import { Box, Button, Center, Heading, Input, InputGroup, InputLeftElement, InputRightElement, Stack, ToastPosition, UseToastOptions, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';

import { FaClipboardCheck } from 'react-icons/fa'
import Head from 'next/head';
import { Task } from '@/pages/api/task';
import TaskList from '@/components/TaskList';

const Home= () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [name, setName] = useState<string>('');

  useEffect(() => {
    const fetchTasks = async () => {
      const response = await fetch('/api/task');
      const data = await response.json();
      setTasks(data);
    };
    fetchTasks();
  }, []);

  const toast = useToast()

  const parameterToast = (message:string,positions:ToastPosition,stat:UseToastOptions['status'],type:string,closeable:boolean) => {
    
    toast({
      title: message,
      position: positions,
      isClosable: closeable,
      status: stat,
      variant: type,
    })
  };
  const handleDelete = async (id: string) => {
    const response = await fetch(`/api/task/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: id
      })
    });
    if (response.ok) {
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      parameterToast(`Task Deleted`,'top-right','success','left-accent',true)
      
    }else if(!response.ok){
      parameterToast(`Something Went Wrong with Deleting`,'top-right','error','left-accent',true)

    }
  };

  

  const handleUpdate = async (id: string) => {
    const taskToUpdate = tasks.find((task) => task.id === id);
    const statusofupdate = !taskToUpdate?.completed
    if (taskToUpdate) {
      const response = await fetch(`/api/task/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...taskToUpdate,
          completed: !taskToUpdate.completed,
        }),
      });

      if (response.ok) {
        const updatedTask: Task = await response.json();
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
        );
        if(statusofupdate == true){
          parameterToast(`Task Marked As Completed`,'top-right','success','left-accent',true)

        }else if(statusofupdate == false) {
          parameterToast(`Task Marked As InComplete`,'top-right','success','left-accent',true)

        }
      }
      else if(!response.ok){
        parameterToast(`Something Went Wrong with Updating`,'top-right','error','left-accent',true)

      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await fetch('/api/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        completed: false,
      }),
    });

    if (response.ok) {
      const task: Task = await response.json();
      setTasks((prevTasks) => [...prevTasks, task]);
      parameterToast(`Task Successfully Added`,'top-right','success','left-accent',true)
      
      setName('');
    }
    else if(response.status == 409){
      parameterToast(`Already Existed Task`,'top-right','error','left-accent',true)
      setName('');
    }else if(response.status == 408){
      parameterToast(`Can not send empty Task`,'top-right','error','left-accent',true)
      
    }
  };

  return (
    <Box w="100%"  bgGradient={[
      
      'linear(to-b, orange.100, purple.300)',
    ]}>
      
      <div>
        <Head>
          <title>Todo App</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <Center>
            <Heading color='purple' py="5">
              To-Do App
            </Heading>
          </Center>
          <form onSubmit={handleSubmit}>
            <Stack py={5} spacing={4}>
              <InputGroup>
                <InputLeftElement
                  pointerEvents='none'
                  children={<FaClipboardCheck color='purple' opacity="0.2" />}
                />
                <Input borderColor='black' focusBorderColor='purple.400' type="text" value={name} onChange={(e) => setName(e.target.value)} />
                <InputRightElement w="20" children={<Button size='md' type='submit' colorScheme='purple' variant='outline'>
                  Button
                </Button>} />
              </InputGroup>
            </Stack>
          </form>

          <TaskList tasks={tasks} handleDelete={handleDelete} handleUpdate={handleUpdate} />
        </main>
      </div>
    </Box>
  );
};

export default Home;