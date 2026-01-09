import { useEffect, useState, useContext } from "react";
import api from "../../support/api/axios";
import { AuthContext } from "../../support/auth/AuthProvider";
import { createTenant, getTenants, disableTenant } from "../../api/api";

export default function AdminTenants() {
  const [tenants, setTenants] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { initialized, authenticated } = useContext(AuthContext);
  const fetchTenants = async () => {
    const res = await api.get("/admin/tenants");
    setTenants(res.data);
  };

  useEffect(() => {
    if(!initialized|| !authenticated) return;
    loadTenants();
  }, [initialized, authenticated]);

  const loadTenants = async () => {
    const res = await getTenants();
    setTenants(res.data);
  };

  const handleAddTenant = async (tenName,mailId) => {
    await createTenant({
      name: tenName,
      email: mailId
    });
    loadTenants();
  };
  
  const deleteTenant = async (id) => {
    await disableTenant(id);
    loadTenants();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Manage Tenants</h2>

      <input
        placeholder="Tenant name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Tenant email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={()=>{handleAddTenant(name,email)}}>Add Tenant</button>

      <div className="tenant-list">
  {tenants.filter((t) => t.is_active).map((t) => (
    <div className="tenant-row" key={t.id}>
      <div className="tenant-col name">
        {t.name}
      </div>

      <div className="tenant-col email">
        {t.email}
      </div>

      <div className="tenant-col action">
        <button
          className="delete-btn"
          onClick={() => deleteTenant(t.tenant_uuid)}
        >
          Delete
        </button>
      </div>
    </div>
  ))}
</div>

    </div>
  );
}
