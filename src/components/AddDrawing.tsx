// import { useRef, useState, useEffect } from 'react';
// import { motion } from 'motion/react';
// import { Button } from './ui/Button';

// const MAX_BYTES = 5 * 1024 * 1024; // 5MB default
// const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

// export default function AddDrawing({ onClose, onUploaded }: { onClose: () => void; onUploaded?: () => void }) {
//   const inputRef = useRef<HTMLInputElement | null>(null);
//   const modalRef = useRef<HTMLDivElement | null>(null);
//   const [description, setDescription] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fileError, setFileError] = useState<string | null>(null);
//   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [childName, setChildName] = useState('Emma');
//   const [age, setAge] = useState<number | ''>(5);
//   const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));

//   useEffect(() => {
//     const prev = document.activeElement as HTMLElement | null;
//     setTimeout(() => inputRef.current?.focus(), 0);
//     const onKey = (e: KeyboardEvent) => {
//       if (e.key === 'Escape') onClose();
//     };
//     document.addEventListener('keydown', onKey);
//     return () => {
//       document.removeEventListener('keydown', onKey);
//       try { prev?.focus(); } catch {}
//     };
//   }, [onClose]);

//   const validateFile = (file: File | null) => {
//     setFileError(null);
//     if (!file) return 'Aucun fichier sélectionné';
//     if (!ALLOWED_TYPES.includes(file.type)) return 'Type de fichier non autorisé (jpeg, png, webp)';
//     if (file.size > MAX_BYTES) return `Fichier trop volumineux (max ${Math.round(MAX_BYTES / 1024 / 1024)}MB)`;
//     return null;
//   };

//   const handleFileChange = () => {
//     const file = inputRef.current?.files?.[0] ?? null;
//     setSelectedFileName(file?.name ?? null);
//     const v = validateFile(file);
//     setFileError(v);
//     if (file && !v) {
//       try {
//         const url = URL.createObjectURL(file);
//         setPreviewUrl(url);
//       } catch {}
//     } else {
//       setPreviewUrl(null);
//     }
//   };

//   const handleDrop = (e: React.DragEvent) => {
//     e.preventDefault();
//     const f = e.dataTransfer.files?.[0] ?? null;
//     if (!f) return;
//     if (inputRef.current) {
//       const dataTransfer = new DataTransfer();
//       dataTransfer.items.add(f);
//       inputRef.current.files = dataTransfer.files;
//       handleFileChange();
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     const file = inputRef.current?.files?.[0] ?? null;
//     const fileValidation = validateFile(file);
//     if (fileValidation) return setFileError(fileValidation);

//   const form = new FormData();
//   form.append('file', file as File);
//   if (description) form.append('description', description);
//   if (childName) form.append('childName', String(childName));
//   if (age !== '') form.append('age', String(age));
//   if (date) form.append('date', String(date));

//     setLoading(true);
//     try {
//       const token = localStorage.getItem('token');
//       const res = await fetch('http://localhost:3000/upload', {
//         method: 'POST',
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'x-description': description || '',
//         },
//         body: form,
//       });
//       if (!res.ok) {
//         const payload = await res.json().catch(() => ({}));
//         throw new Error(payload?.error || `Erreur ${res.status}`);
//       }
//       const data = await res.json();
//       console.log('Uploaded', data);
//       if (onUploaded) onUploaded();
//     } catch (err: any) {
//       setError(err.message || "Erreur lors de l'upload");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <motion.div
//       ref={modalRef}
//       role="dialog"
//       aria-modal="true"
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       style={{
//         position: 'fixed',
//         inset: 0,
//         display: 'flex',
//         alignItems: 'center',
//         justifyContent: 'center',
//         background: 'rgba(0,0,0,0.4)',
//         zIndex: 9999,
//       }}
//       onClick={(e) => {
//         if (e.target === modalRef.current) onClose();
//       }}
//     >
//       <div className="add-drawing-modal" style={{ background: 'transparent', padding: 0 }}>
//         <div className="modal-inner" style={{ width: 520, maxWidth: '96%' }}>
//           <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
//             <h3 style={{ margin: 0, fontFamily: '$font-hand' }}>Upload Masterpiece 🎨</h3>
//             <Button aria-label="Fermer" onClick={onClose} style={{ marginLeft: 12 }}>✕</Button>
//           </div>

//           <form onSubmit={handleSubmit}>
//             <div style={{ marginTop: 12 }}>
//               <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop} onClick={() => inputRef.current?.click()} role="button" aria-label="Drop zone">
//                 <div style={{ textAlign: 'center' }}>
//                   <div className="hint">Drop your little one's art here 🎨</div>
//                   <div style={{ marginTop: 6, fontSize: '13px', color: 'rgba(0,0,0,0.6)' }}>or click to browse files</div>
//                   <div style={{ marginTop: 8, fontSize: '13px', color: 'rgba(0,0,0,0.6)' }}>{selectedFileName}</div>
//                 </div>
//                 <input ref={inputRef} type="file" accept={ALLOWED_TYPES.join(',')} onChange={handleFileChange} style={{ display: 'none' }} />
//               </div>
//               {fileError && <div style={{ color: 'red', marginTop: 6 }}>{fileError}</div>}
//               {previewUrl && <div style={{ marginTop: 8 }}><img src={previewUrl} alt="preview" style={{ width: '100%', borderRadius: 8 }} /></div>}
//             </div>

//             <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 80px', gap: 12 }}>
//               <div>
//                 <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>add date</label>
//                 <input className="input" type="date" value={date} onChange={e => setDate(e.target.value)} />
//               </div>
//               <div>
//                 <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>age</label>
//                 <input className="input" type="number" min={1} max={16} value={String(age)} onChange={e => setAge(e.target.value === '' ? '' : Number(e.target.value))} />
//               </div>
//             </div>

//             <div style={{ marginTop: 12 }}>
//               <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Emma</label>
//               <input className="input" placeholder="Emma" value={childName} onChange={e => setChildName(e.target.value)} />
//             </div>

//             <div style={{ marginTop: 12 }}>
//               <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>add description</label>
//               <textarea className="input" placeholder="Description (optionnelle)" value={description} onChange={(e) => setDescription(e.target.value)} style={{ minHeight: 80 }} />
//             </div>

//             <div style={{ marginTop: 14, display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
//               <Button type="button" onClick={onClose} disabled={loading}>Cancel</Button>
//               <Button type="submit" disabled={loading || !!fileError} variant="primary">{loading ? 'Uploading...' : 'Upload Masterpiece ✨'}</Button>
//             </div>
//             {error && <p style={{ color: 'red' }}>{error}</p>}
//           </form>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
