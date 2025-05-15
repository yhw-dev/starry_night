import EditForm from "./editForm";

export default async function EditPage(props) {
  const params = await props.params;
  return <EditForm postId={params.id} />;
}