export const sparesController = async (req: AuthRequest, res: Response) => {
try {
if (!req.user || req.user.role !== "admin") {
return res.status(403).json({ message: "Unauthorized" });
}

    const { name, description, price } = req.body;
    const image = req.file
      ? /* req.file.path   */ `/uploads/${req.file.filename}`
      : "";
    const spares = new SpareParts({ name, description, price, image });
    await spares.save();
    res.status(200).json({ message: "Spares created successfully", spares });

} catch (error) {
res.status(500).json({ message: "Error creating spares", error });
}
};

// Route for posting spare parts
router.post(
"/service/spares",
authMiddleware(["admin"]),
upload.single("image"),
sparesController
);

interface FormData {
name: string;
description: string;
price: string;
image: File | null;
}

const AddNewSpares: React.FC = () => {
const [formData, setFormData] = useState<FormData>({
name: "",
description: "",
price: "",
image: null,
});
const [isSidebarOpen, setIsSidebarOpen] = useState(false);
const navigate = useNavigate();

const handleToggleSidebar = () => {
setIsSidebarOpen(!isSidebarOpen);
};

const handleChange = (
e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
) => {
const { name, value, files } = e.target as HTMLInputElement; // Ensure correct casting to HTMLInputElement
if (name === "image") {
setFormData((prevData) => ({
...prevData,
[name]: files ? files[0] : null, // Access files property safely
}));
} else {
setFormData((prevData) => ({
...prevData,
[name]: value,
}));
}
};

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
e.preventDefault();
const data = new FormData();
data.append("name", formData.name);
data.append("description", formData.description);
data.append("price", formData.price);
if (formData.image) {
data.append("image", formData.image);
}

    try {
      await axios.post("http://localhost:8000/api/admin/service/spares", data, {
        withCredentials: true, // Include cookies in requests
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Service upload successful!");
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Error:", error);
    }

};

return (
<>
<div className="admin-dashboard">
<div className="top-buttons">
<button className="toggle-btn" onClick={handleToggleSidebar}>
{isSidebarOpen ? "X" : "☰"}
</button>
</div>
<div className={`sidebar ${isSidebarOpen ? "sidebar-open" : ""}`}>
<ul>
<li className="admin-links">
<Link to={"/admin/vieworders"}>View Orders</Link>
</li>
<li className="admin-links">
<Link to={"/admin/manageorders"}>Manage Orders</Link>
</li>
<li className="admin-links">
<Link to={"/admin/manageworkers"}>Manage Workers</Link>
</li>
<li className="admin-links">
<Link to={"/admin/createworkersaccounts"}>Add New Workers</Link>
</li>
<li className="admin-links">
<Link to={"/admin/addnewservices"}>Add New Services</Link>
</li>
<li className="admin-links">
<Link to={"/admin/addnewspares"}>Add New Spares</Link>
</li>
</ul>
</div>
</div>
<form onSubmit={handleSubmit}>
<div className="authenticate-users-container">
<div className="details">
<h1 className="large-details">
Add a new spare part to your website
</h1>
<h3 className="small-details">
This spare part will be sold to clients
</h3>
</div>
<div className="input-container">
<div className="labels-input">
<label className="input-labels">Name</label>
<input
                name="name"
                type="text"
                className="input"
                onChange={handleChange}
              />
</div>
<div className="line"></div>
</div>

          <div className="input-container">
            <div className="labels-input">
              <label className="input-labels">Description</label>
              <input
                name="description"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="line"></div>
          </div>

          <div className="input-container">
            <div className="labels-input">
              <label className="input-labels">Price (Ksh)</label>
              <input
                name="price"
                type="text"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="line"></div>
          </div>

          <div className="input-container">
            <div className="labels-input">
              <label className="input-labels">Image</label>
              <input
                name="image"
                type="file"
                className="input"
                onChange={handleChange}
              />
            </div>
            <div className="line"></div>
          </div>

          <button type="submit" className="sign-up-log-in-btn">
            Upload Spare Part
          </button>
        </div>
      </form>
    </>

);
};

export default AddNewSpares;

export const createProduct = async (req: Request, res: Response) => {
try {
const {
name,
slug,
price,
category,
brand,
countInStock,
rating,
numberOfReviews,
description,
} = req.body;
const image = req.file
? /_ req.file.path _/ `/uploads/${req.file.filename}`
: "";
const newProduct = new Product({
name,
slug,
image,
price,
category,
brand,
countInStock,
rating,
numberOfReviews,
description,
});
await newProduct.save();
res.status(201).send({ message: "Product Created", newProduct });
} catch (error) {
res.status(500).send({ message: "Error creating product", error });
}
};

export const createProduct = async (req: Request, res: Response) => {
try {
const newProduct = new Product({
name: "sample name " + Date.now(),
slug: "sample-name-" + Date.now(),
image: "/images/p1.jpg",
price: 2000,
category: "sample category",
brand: "sample brand",
countInStock: 0,
rating: 0,
numberOfReviews: 0,
description: "sample description",
});
const product = await newProduct.save();
res.status(201).send({ message: "Product Created", product });
} catch (error) {
res.status(500).send({ message: "Error creating product", error });
}
};
