

import React, { useEffect, useState } from 'react';
import { Task } from '@/pages/api/task';
import { FaTrash } from 'react-icons/fa'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
  Checkbox,
  Center,
  IconButton,
  Text,
  Box
} from '@chakra-ui/react'

type TaskProps = {
  task: Task;
  handleDelete: (id: string) => Promise<void>;
  handleUpdate: (id: string) => Promise<void>;
};

const Task: React.FC<TaskProps> = ({ task, handleDelete, handleUpdate }) => {
  return (
    <li key={task.id}>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => handleUpdate(task.id)}
      />
      <span>{task.name}</span>
      <button onClick={() => handleDelete(task.id)}>Delete</button>
    </li>
  );
};

type TaskListProps = {
  tasks: Task[];
  handleDelete: (id: string) => Promise<void>;
  handleUpdate: (id: string) => Promise<void>;
};

const TaskList: React.FC<TaskListProps> = ({ tasks, handleDelete, handleUpdate }) => {
  const [updatedTasks, setUpdatedTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setUpdatedTasks(tasks);
  }, [tasks]);

  return (
    <Box>
      <TableContainer whiteSpace={'normal'}>
        <Table size='sm' variant='striped' colorScheme='purple'>
          <Thead>
            <Tr>
              <Th><Center> Status </Center></Th>
              <Th><Center>List</Center></Th>
              <Th><Center>Action</Center></Th>
            </Tr>
          </Thead>
          <Tbody>
            {updatedTasks.map((task) => (
              <Tr key={task.id}>
                <Td>
                  <Center>
                    <Checkbox size='lg' border='black' colorScheme='purple' isChecked={task.completed}
                      onChange={() => handleUpdate(task.id)}>

                    </Checkbox>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <Text>
                      {task.name}
                    </Text>
                  </Center>
                </Td>
                <Td>
                  <Center>
                    <IconButton
                      onClick={() => handleDelete(task.id)}
                      colorScheme='purple'
                      aria-label='Delete Todo'
                      icon={<FaTrash />}
                    />
                  </Center>
                </Td>
              </Tr>
            ))}

          </Tbody>
          <Tfoot>
            <Tr>
              <Th><Center> Status </Center></Th>
              <Th><Center>List</Center></Th>
              <Th><Center>Action</Center></Th>
            </Tr>
          </Tfoot>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TaskList;