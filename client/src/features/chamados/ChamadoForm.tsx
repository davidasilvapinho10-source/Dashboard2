import { useState } from "react";

const API = "http://localhost:3333/api";

export function ChamadoForm({ onSaved }: { onSaved: () => void | Promise<void> }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch(`${API}/chamados`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo,
        descricao,
        status: "aberto",
        setor: "Operações",
        responsavel: "Analista Front",
        prioridade: "media"
      })
    });
    setTitulo("");
    setDescricao("");
    await onSaved();
  };

  return (
    <form onSubmit={submit} className="form">
      <h3>Novo Chamado</h3>
      <input placeholder="Título" value={titulo} onChange={(e) => setTitulo(e.target.value)} required minLength={3} />
      <textarea placeholder="Descrição" value={descricao} onChange={(e) => setDescricao(e.target.value)} required minLength={5} />
      <button type="submit">Cadastrar</button>
    </form>
  );
}
