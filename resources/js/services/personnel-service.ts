import axiosIntance from "./_inital-service";


const subdirectoryPath = 'personnel'
const PersonnelService = {

    GetAll: async () => {
        const { data } = await axiosIntance.get(subdirectoryPath + "/list")

        return data;
    }

}

export default PersonnelService;