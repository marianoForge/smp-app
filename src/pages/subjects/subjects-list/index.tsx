import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  Link as LinkButton,
  Button,
  Container,
} from "@mui/material";
import Link from "next/link";

interface Teacher {
  _id: string;
  name: string;
}

interface Subject {
  _id: string;
  name: string;
  description: string;
  teachersAssigned: string[];
  pupilsAssigned: string[];
  timestamp: Date;
}

const SubjectsTable = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [currentTeachers, setCurrentTeachers] = useState<Teacher[]>([]);

  useEffect(() => {
    const fetchSubjects = async () => {
      const response = await fetch("/api/v1/subjects");
      const data = await response.json();
      setSubjects(data);
    };

    fetchSubjects();
  }, []);

  const handleOpenDialog = async (teacherIds: string[]) => {
    try {
      const promises = teacherIds.map((id) =>
        fetch(`/api/v1/teachers/${id}`)
          .then((res) => res.json())
          .then((data) => data.teacher)
      );
      const teachersDetails = await Promise.all(promises);
      setCurrentTeachers(teachersDetails);
      setOpenDialog(true);
    } catch (error) {
      console.error("Error fetching teacher details:", error);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <Container maxWidth="xl">
      <Button variant="contained" color="primary" className="bg-[#1976D2] my-4">
        <Link href="pupils-form">Add Subject</Link>
      </Button>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="subject table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Teachers Assigned</TableCell>
              <TableCell>Pupils Assigned</TableCell>
              <TableCell>Timestamp</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {subjects.length > 0 &&
              subjects.map((subject) => (
                <TableRow key={subject._id}>
                  <TableCell>{subject.name}</TableCell>
                  <TableCell>{subject.description}</TableCell>
                  <TableCell>
                    <LinkButton
                      component="button"
                      onClick={() => handleOpenDialog(subject.teachersAssigned)}
                    >
                      {subject.teachersAssigned.length} Teachers
                    </LinkButton>
                  </TableCell>
                  <TableCell>{subject.pupilsAssigned.length}</TableCell>
                  <TableCell>
                    {new Date(subject.timestamp).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>Teachers Assigned</DialogTitle>
          <DialogContent>
            {currentTeachers.map((teacher) => (
              <div key={teacher._id}>{teacher.name}</div> // Display teacher names or other info
            ))}
          </DialogContent>
        </Dialog>
      </TableContainer>
    </Container>
  );
};

export default SubjectsTable;
