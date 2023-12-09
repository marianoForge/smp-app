import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import {
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
  Container,
} from "@mui/material";
import { SelectChangeEvent } from "@mui/material/Select";

interface Teacher {
  _id: string;
  name: string;
}

interface Pupil {
  _id: string;
  name: string;
}

interface SubjectData {
  name: string;
  description: string;
  teachersAssigned: string[];
  pupilsAssigned: string[];
}

const SubjectForm = () => {
  const [subjectData, setSubjectData] = useState<SubjectData>({
    name: "",
    description: "",
    teachersAssigned: [],
    pupilsAssigned: [],
  });
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [pupils, setPupils] = useState<Pupil[]>([]);

  useEffect(() => {
    // Fetch Teachers and Pupils data
    const fetchData = async () => {
      try {
        const teachersResponse = await fetch("/api/v1/teachers");
        const pupilsResponse = await fetch("/api/v1/pupils");
        const teachersData = await teachersResponse.json();
        const pupilsData = await pupilsResponse.json();
        setTeachers(teachersData);
        setPupils(pupilsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSubjectData({ ...subjectData, [event.target.name]: event.target.value });
  };

  const renderSelectedTeachers = (selectedTeacherIds: string[]) => {
    const selectedTeacherNames = selectedTeacherIds.map(
      (id) => teachers.find((teacher) => teacher._id === id)?.name || ""
    );
    return selectedTeacherNames.join(", ");
  };

  const renderSelectedPupils = (selectedPupilIds: string[]) => {
    const selectedPupilNames = selectedPupilIds.map(
      (id) => pupils.find((pupil) => pupil._id === id)?.name || ""
    );
    return selectedPupilNames.join(", ");
  };

  const handleMultiSelectChange =
    (field: keyof SubjectData) => (event: SelectChangeEvent<string[]>) => {
      setSubjectData({
        ...subjectData,
        [field]: event.target.value as string[],
      });
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const response = await fetch("/api/v1/subjects", {
        // Replace with your API endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(subjectData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log(result); // Handle the response data
      alert("Subject added successfully"); // Simple feedback
      // Optionally reset the form
      setSubjectData({
        name: "",
        description: "",
        teachersAssigned: [],
        pupilsAssigned: [],
      });
    } catch (error) {
      console.error("There was a problem with the fetch operation:", error);
      alert("Error adding subject"); // Error feedback
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <TextField
          label="Name"
          name="name"
          value={subjectData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Description"
          name="description"
          value={subjectData.description}
          onChange={handleChange}
          fullWidth
          margin="normal"
          multiline
          rows={4}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel id="teachers-label">Assigned Teachers</InputLabel>
          <Select
            labelId="teachers-label"
            id="teachers"
            multiple
            value={subjectData.teachersAssigned}
            onChange={handleMultiSelectChange("teachersAssigned")}
            input={<OutlinedInput label="Assigned Teachers" />}
            renderValue={(selected) =>
              renderSelectedTeachers(selected as string[])
            }
          >
            {teachers.map((teacher) => (
              <MenuItem key={teacher._id} value={teacher._id}>
                <Checkbox
                  checked={subjectData.teachersAssigned.includes(teacher._id)}
                />
                <ListItemText primary={teacher.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth margin="normal">
          <InputLabel id="pupils-label">Assigned Pupils</InputLabel>
          <Select
            labelId="pupils-label"
            id="pupils"
            multiple
            value={subjectData.pupilsAssigned}
            onChange={handleMultiSelectChange("pupilsAssigned")}
            input={<OutlinedInput label="Assigned Pupils" />}
            renderValue={(selected) =>
              renderSelectedPupils(selected as string[])
            }
          >
            {pupils.map((pupil) => (
              <MenuItem key={pupil._id} value={pupil._id}>
                <Checkbox
                  checked={subjectData.pupilsAssigned.includes(pupil._id)}
                />
                <ListItemText primary={pupil.name} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button
          type="submit"
          variant="contained"
          color="primary"
          className="bg-black mt-2"
        >
          Add Subject
        </Button>
      </Box>
    </Container>
  );
};

export default SubjectForm;
