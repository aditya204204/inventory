"use client";
import { useState, useEffect } from "react";
import { firestore } from "@/firebase";
import {
  Box,
  Button,
  Modal,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { collection, getDocs, query, doc, deleteDoc, getDoc, setDoc } from "firebase/firestore";

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  //UPDATE INVENTORY
  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  //REMOVE ITEMS
  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
        console.log("Document successfully deleted!");
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    } else {
      console.log("No such document!");
    }

    await updateInventory();
  };

  //ADD ITEMS
  const addItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }

    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // Filter inventory based on search query
  const filteredInventory = inventory.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      p={4}
    >
      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          borderRadius="8px"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{ transform: "translate(-50%,-50%)" }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value);
              }}
            ></TextField>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#1976d2",
                color: "white",
                "&:hover": {
                  bgcolor: "#1565c0",
                },
              }}
              onClick={() => {
                addItem(itemName);
                setItemName("");
                handleClose();
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Button
        variant="contained"
        sx={{
          bgcolor: "#1976d2",
          color: "white",
          "&:hover": {
            bgcolor: "#1565c0",
          },
        }}
        onClick={() => {
          handleOpen();
        }}
      >
        Add New Item
      </Button>

      {/* Search Bar */}
      <TextField
        variant="outlined"
        placeholder="Search Items..."
        fullWidth
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ marginBottom: 2, maxWidth: "800px" }}
      />

      <Box border="1px solid #333" borderRadius="8px" width="800px">
        <Box
          width="100%"
          height="100px"
          display="flex"
          bgcolor="#ADD8E6"
          alignItems="center"
          justifyContent="center"
          borderRadius="8px 8px 0 0"
        >
          <Typography variant="h2" color="#333">
            Inventory Items
          </Typography>
        </Box>

        <Stack width="100%" height="500px" spacing={2} overflow="auto" p={2}>
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="100%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              bgcolor="#f0f0f0"
              padding={3}
              borderRadius="8px"
              boxShadow="0 4px 8px rgba(0, 0, 0, 0.1)"
            >
              <Typography variant="h4" color="#333" textAlign="center">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant="h4" color="#333" textAlign="center">
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#1976d2",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#1565c0",
                    },
                  }}
                  onClick={() => {
                    addItem(name);
                  }}
                >
                  Add
                </Button>

                <Button
                  variant="contained"
                  sx={{
                    bgcolor: "#d32f2f",
                    color: "white",
                    "&:hover": {
                      bgcolor: "#c62828",
                    },
                  }}
                  onClick={() => {
                    removeItem(name);
                  }}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  );
}
