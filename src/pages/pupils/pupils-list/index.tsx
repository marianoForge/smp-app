import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
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
  dob?: string;
  age: number;
  phone?: string;
  tutor: string;
  tutorContact: string;
  subjects: Subject[];
  timestamp: string;
}

const PupilsTable = () => {
  const [pupils, setPupils] = useState<Pupil[]>([]);
  const { status } = useSession();

  useEffect(() => {
    const fetchPupils = async () => {
      const response = await fetch("/api/v1/pupils");
      const data = await response.json();
      setPupils(data);
    };

    fetchPupils();
  }, []);

  const getSubjectNames = (subjects: Subject[]) => {
    return subjects.map((subject) => subject.name).join(", ");
  };

  return (
    <Container maxWidth="xl">
      <Button variant="contained" color="primary" className="bg-[#1976D2] my-4">
        <Link href="pupils-form">Add Pupil</Link>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="pupil table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell>Tutor Contact</TableCell>
              <TableCell>Subjects</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pupils.length > 0 &&
              pupils.map((pupil) => (
                <TableRow key={pupil._id}>
                  <TableCell>{pupil.name}</TableCell>
                  <TableCell>{pupil.email}</TableCell>
                  <TableCell>
                    {pupil.dob
                      ? new Date(pupil.dob).toLocaleDateString()
                      : "N/A"}
                  </TableCell>
                  <TableCell>{pupil.age}</TableCell>
                  <TableCell>{pupil.phone}</TableCell>
                  <TableCell>{pupil.tutor}</TableCell>
                  <TableCell>{pupil.tutorContact}</TableCell>
                  <TableCell>{getSubjectNames(pupil.subjects)}</TableCell>

                  <TableCell>
                    {new Date(pupil.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default PupilsTable;
