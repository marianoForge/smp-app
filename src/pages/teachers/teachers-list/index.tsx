import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Container,
} from "@mui/material";
import Link from "next/link";

// Define interfaces for Pupil and Subject
interface Subject {
  _id: string;
  name: string;
  description: string;
}

interface Pupil {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subjects: Subject[];
  timestamp: string;
}

const TeachersTable = () => {
  const [teachers, setTeachers] = useState<Pupil[]>([]);

  useEffect(() => {
    const fetchPupils = async () => {
      const response = await fetch("/api/v1/teachers");
      const data = await response.json();
      setTeachers(data);
    };

    fetchPupils();
  }, []);

  const getSubjectNames = (subjects: Subject[]) => {
    return subjects.map((subject) => subject.name).join(", ");
  };

  return (
    <Container maxWidth="xl">
      <Button variant="contained" color="primary" className="bg-[#1976D2] my-4">
        <Link href="teachers-form">Add Teacher</Link>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="pupil table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {teachers.length > 0 &&
              teachers.map((teacher) => (
                <TableRow key={teacher._id}>
                  <TableCell>{teacher.name}</TableCell>
                  <TableCell>{teacher.email}</TableCell>
                  <TableCell>{teacher.phone}</TableCell>
                  <TableCell>{getSubjectNames(teacher.subjects)}</TableCell>
                  <TableCell>
                    {new Date(teacher.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default TeachersTable;
