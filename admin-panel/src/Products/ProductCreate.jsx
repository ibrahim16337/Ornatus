import { useState, useEffect } from 'react';
import { Create, SimpleForm, TextInput, SelectInput } from 'react-admin';
import dataProvider from '../Dataprovider';
import axios from 'axios';
import { ImageInput } from 'react-admin';
async function getData(resource){
  const response = await dataProvider.getList(resource);
  return response.map(({ timestamp_id: id, categories: name }) => ({ id, name }));
}

const UCARE_API_KEY = '8815f8b098b5b093d681';

const uploadImageToUCareCDN = async (file) => {
  const formData = new FormData();
  formData.append('uploadcare', file);

  try {
    const response = await axios.post(`https://upload.uploadcare.com/base/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Uploadcare.Simple ${UCARE_API_KEY}`
      }
    });

    return response.data.file;
  } catch (error) {
    console.error('Error uploading image to uCare CDN:', error);
    throw error;
  }
};

const ProductCreate = (props) => {
  const [categories, setCategories] = useState([]);
  //const [styles, getStyles] = useState([]);
  const [imageCdnUrl, setImageCdnUrl] = useState('');
  const handleImageUpload = async (file) => {
    try {
      const cdnUrl = await uploadImageToUCareCDN(file.rawFile);
      setImageCdnUrl(cdnUrl);
      console.log("The value of the image path is ",cdnUrl);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const categoriesData = await getData('category');
      setCategories(categoriesData);

      // uncomment when styles api endoint is added.
      // const stylesData = await getData('styles');
      // setStyles(stylesData);
    };

    fetchData();
  }, []);

  return (
    <Create {...props}>
      <SimpleForm>
        <TextInput source="name" />
        <SelectInput source="category" choices={categories} />
        {/* <SelectInput source="styles" choices={styles} /> */}
        <SelectInput
          source="styles"
          choices={[
            { id: '1713160520_2198873a-03fe-46c5-b874-41168b656ea4', name: 'Industrial' },
            { id: '1713160520_45133390-f262-48a5-a617-76e0de1ebb47', name: 'Transitional' }
          ]}
        />
        <TextInput source="price" />
        <TextInput source="description" />
        <TextInput source="stock" />
        <ImageInput source="image" label="Upload Image" accept="image/*" onUpload={handleImageUpload}>
          <TextInput source="imageUrl" value={imageCdnUrl} disabled />
        </ImageInput>
      </SimpleForm>
    </Create>
  );
};

export default ProductCreate;
